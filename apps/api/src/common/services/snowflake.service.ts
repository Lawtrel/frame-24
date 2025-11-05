import { Injectable, OnModuleInit } from '@nestjs/common';
import { Snowflake } from '@sapphire/snowflake';
import { SNOWFLAKE_CONFIG } from '../config/snowflake.config';
import { LoggerService } from './logger.service';

@Injectable()
export class SnowflakeService implements OnModuleInit {
  private readonly snowflake: Snowflake;

  constructor(private readonly logger: LoggerService) {
    this.snowflake = new Snowflake(SNOWFLAKE_CONFIG.epoch);
  }

  onModuleInit(): void {
    this.logger.log(
      'Snowflake ID Generator inicializado',
      SnowflakeService.name,
      {
        workerId: SNOWFLAKE_CONFIG.workerId.toString(),
        epoch: new Date(SNOWFLAKE_CONFIG.epoch).toISOString(),
      },
    );
  }

  /**
   * Gera um Snowflake ID único
   * @returns String ID (ex: "7234567890123456789")
   */
  generate(): string {
    try {
      const id = this.snowflake.generate();
      return id.toString();
    } catch (error) {
      this.logger.error(
        'Erro ao gerar Snowflake ID',
        error instanceof Error ? error.stack : String(error),
        SnowflakeService.name,
      );
      throw new Error('Falha ao gerar ID único');
    }
  }

  /**
   * Gera múltiplos IDs de uma vez
   * @param count Quantidade de IDs
   * @returns Array de IDs
   */
  generateBulk(count: number): string[] {
    return Array.from({ length: count }, () => this.generate());
  }

  /**
   * Extrai o timestamp de um Snowflake ‘ID’
   * @param id Snowflake ‘ID’
   * @returns Data de criação do ‘ID’
   */
  getTimestamp(id: string | bigint): Date | null {
    try {
      const bigIntId = typeof id === 'string' ? BigInt(id) : id;
      const deconstructed = this.snowflake.deconstruct(bigIntId);
      return new Date(Number(deconstructed.timestamp));
    } catch (error) {
      this.logger.error(
        'Erro ao extrair timestamp do Snowflake ID',
        error instanceof Error ? error.stack : String(error),
        SnowflakeService.name,
      );
      return null;
    }
  }

  /**
   * Valida se um ‘ID’ é um Snowflake válido
   * @param id ID para validar
   * @returns Boolean
   */
  isValid(id: string | bigint): boolean {
    try {
      if (!id) return false;
      const bigIntId = typeof id === 'string' ? BigInt(id) : id;
      return bigIntId > 0n;
    } catch {
      return false;
    }
  }

  /**
   * Deconstruct completo do Snowflake ID
   * @param id Snowflake ID
   * @returns Objeto com timestamp, workerId, increment
   */
  deconstruct(id: string | bigint): {
    timestamp: Date;
    workerId: bigint;
    increment: bigint;
  } | null {
    try {
      const bigIntId = typeof id === 'string' ? BigInt(id) : id;
      const deconstructed = this.snowflake.deconstruct(bigIntId);
      return {
        timestamp: new Date(Number(deconstructed.timestamp)),
        workerId: deconstructed.workerId,
        increment: deconstructed.increment,
      };
    } catch (error) {
      this.logger.error(
        'Erro ao desconstruir Snowflake ID',
        error instanceof Error ? error.stack : String(error),
        SnowflakeService.name,
      );
      return null;
    }
  }
}
