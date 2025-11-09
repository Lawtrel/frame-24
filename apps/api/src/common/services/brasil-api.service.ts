import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';

interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  opcao_pelo_simples: boolean | null;
}

@Injectable()
export class BrasilApiService {
  private readonly logger = new Logger(BrasilApiService.name);
  private readonly client = axios.create({
    baseURL: 'https://brasilapi.com.br/api',
  });

  async getCnpjData(cnpj: string): Promise<CnpjData | null> {
    try {
      const sanitizedCnpj = cnpj.replace(/\D/g, '');
      this.logger.log(`Querying BrasilAPI for CNPJ: ${sanitizedCnpj}`);

      const response = await this.client.get<CnpjData>(
        `/cnpj/v1/${sanitizedCnpj}`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          this.logger.warn(`CNPJ not found on BrasilAPI: ${cnpj}`);
          return null;
        }

        this.logger.error(
          `BrasilAPI request failed (status: ${error.response?.status ?? 'unknown'})`,
          error.stack || error.message,
        );
      } else if (error instanceof Error) {
        this.logger.error(
          'BrasilAPI request failed unexpectedly.',
          error.stack,
        );
      } else {
        this.logger.error(
          'BrasilAPI request failed with unknown error type.',
          String(error),
        );
      }

      throw new InternalServerErrorException(
        'Falha ao consultar dados externos do CNPJ.',
      );
    }
  }
}
