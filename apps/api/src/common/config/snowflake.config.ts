/**
 * Configuração do Snowflake ID Generator
 *
 * Estrutura do Snowflake (64 bits) conforme @sapphire/snowflake:
 * - 41 bits: timestamp (milissegundos desde epoch customizada)
 * - 5 bits: worker ID (0-31)
 * - 5 bits: process ID (0-31)
 * - 12 bits: increment/sequence (0-4095 por milissegundo)
 */

function getWorkerId(): bigint {
  // Desenvolvimento: sempre 1
  if (process.env.NODE_ENV === 'development') {
    return 1n;
  }

  // Produção: pega de variável de ambiente
  // Cada instância/pod deve ter um WORKER_ID único (0-31)
  const workerId =
    process.env.WORKER_ID || process.env.HOSTNAME?.slice(-3) || '1';

  const id = BigInt(parseInt(workerId, 10));

  // Garante que está no range válido (0-31)
  return id & 0b11111n;
}

export const SNOWFLAKE_CONFIG = {
  // Epoch customizada: 1 de janeiro de 2024 00:00:00 UTC
  // Isso dá ~69 anos de IDs únicos a partir dessa data
  epoch: new Date('2024-01-01T00:00:00Z').getTime(),

  // Worker ID baseado no ambiente (0-31)
  workerId: getWorkerId(),
};
