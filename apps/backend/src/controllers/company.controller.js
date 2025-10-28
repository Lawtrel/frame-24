import prisma from '../lib/prisma.js';
import { createCompanyAndAdminStructure } from '../services/company.service.js';
import logger from "../utils/logger.js";


export const createCompany = async (req, res) => {
    const data = req.body;
    const {
        corporate_name,
        cnpj,
        admin_email,
        admin_password,
        admin_name,
        admin_cpf,
        ibge_municipality_code
    } = data;

    try {
        if (!corporate_name || !cnpj || !admin_email || !admin_password ||
            !admin_name || !admin_cpf || !ibge_municipality_code) {

            logger.warn('Dados incompletos recebidos para createCompany.', {
                requiredFields: [
                    'corporate_name', 'cnpj', 'admin_email', 'admin_password',
                    'admin_name', 'admin_cpf', 'ibge_municipality_code' // Lista de campos
                ]
            });
            return res.status(400).json({ error: 'Dados incompletos. Verifique todos os campos, incluindo o código IBGE do município.' });
        }

        const ibgeCodeString = String(ibge_municipality_code);
        if (ibgeCodeString.length !== 7 || isNaN(Number(ibgeCodeString))) {
            logger.warn(`Código IBGE inválido: ${ibge_municipality_code}`);
            return res.status(400).json({ error: 'O código IBGE deve ser um número de 7 dígitos.' });
        }

        logger.info(`Checando conflito para CNPJ: ${cnpj} e Email: ${admin_email}`);

        const [existingCompany, existingIdentity] = await Promise.all([
            prisma.companies.findUnique({ where: { cnpj } }),
            prisma.identities.findFirst({ where: { email: admin_email } })
        ]);

        if (existingCompany) {
            logger.warn(`Tentativa de cadastro com CNPJ existente: ${cnpj}`);
            return res.status(409).json({ error: 'CNPJ já cadastrado' });
        }
        if (existingIdentity) {
            logger.warn(`Tentativa de cadastro com Email existente: ${admin_email}`);
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        logger.info(`Iniciando transação para criar a empresa: ${corporate_name}`);
        const { company, employee, tenant_slug } = await createCompanyAndAdminStructure(data);

        logger.info('Estrutura de empresa e Admin criada com sucesso.', {
            companyId: company.id,
            tenant: tenant_slug
        });

        res.status(201).json({
            success: true,
            message: 'Empresa e administrador criados com sucesso!',
            data: {
                company: {
                    id: company.id.toString(),
                    name: corporate_name,
                    tenant_slug
                },
                admin: {
                    email: admin_email,
                    employee_number: employee.employee_number
                }
            }
        });

    } catch (error) {
        logger.error('ERRO INTERNO NO createCompany (Transação Revertida)', {
            message: error.message,
            stack: error.stack,
            inputEmail: admin_email
        });

        res.status(500).json({
            error: 'Erro interno no cadastro da empresa',
            details: error.message
        });
    }
};