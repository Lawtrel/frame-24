import logger from '../utils/logger.js';
export class OPAService {

    static getOpaUrl() {
        return process.env.OPA_URL || 'http://localhost:8181';
    }

    static async check(input) {
        const opaUrl = this.getOpaUrl();

        const logData = {
            resource: input.resource?.type,
            action: input.action,
            tenant: input.user?.tenant_id,
            url: `${opaUrl}/v1/data/authz/allow`
        };

        try {
            logger.info('Consultando OPA para decisão de política.');

            const response = await fetch(logData.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input })
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.warn(`OPA retornou status não-OK: ${response.status}`, { ...logData, opaResponse: errorText });
                return false;
            }

            const result = await response.json();
            const allowed = result.result === true;

            logger.info('Resposta OPA recebida.');

            return allowed;

        } catch (error) {
            logger.error('Erro de rede ou processamento no OPA Service check.', {
                ...logData,
                message: error.message
            });
            return false;
        }
    }


    static async healthCheck() {
        const opaUrl = this.getOpaUrl();
        try {
            const response = await fetch(`${opaUrl}/health`);

            if (!response.ok) {
                logger.warn('OPA health check falhou.', { status: response.status, url: `${opaUrl}/health` });
                return false;
            }
            logger.debug('OPA health check OK.');
            return true;

        } catch (error) {
            logger.error('OPA health check failed (Erro de rede).', {
                url: `${opaUrl}/health`,
                message: error.message
            });
            return false;
        }
    }



    static async updatePolicy(policyId, regoCode) {
        const opaUrl = this.getOpaUrl();
        const url = `${opaUrl}/v1/policies/${policyId}`;

        try {
            logger.info(`Tentando atualizar política OPA: ${policyId}`);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: regoCode
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error('OPA rejeitou a política Rego (Parsing Error ou similar).', {
                    policyId: policyId,
                    status: response.status,
                    opaErrorDetails: errorText,
                });
                return false;
            }

            logger.info(`Política OPA atualizada com sucesso: ${policyId}`);
            return true;

        } catch (error) {
            logger.error('Erro de rede ao tentar atualizar política OPA.', {
                policyId: policyId,
                message: error.message,
                url: url
            });
            return false;
        }
    }
}