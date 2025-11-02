/**
 * Configuração do Snowflake ID Generator
 *
 * Estrutura do Snowflake (64 bits):
 * - 41 bits: timestamp (milissegundos desde epoch customizada)
 * - 10 bits: worker/machine ID (0-1023)
 * - 12 bits: sequence number (0-4095 por milissegundo)
 */

function getWorkerId(): bigint {
  // Desenvolvimento: sempre 1
  if (process.env.NODE_ENV === 'development') {
    return 1n;
  }

  // Produção: pega de variável de ambiente
  // Cada instância/pod deve ter um WORKER_ID único (0-1023)
  const workerId =
    process.env.WORKER_ID || process.env.HOSTNAME?.slice(-3) || '1';

  return BigInt(parseInt(workerId, 10));
}

export const SNOWFLAKE_CONFIG = {
  // Epoch customizada: 1 de janeiro de 2024 00:00:00 UTC
  // Isso dá ~69 anos de IDs únicos a partir dessa data
  epoch: new Date('2024-01-01T00:00:00Z').getTime(),

  // Worker ID baseado no ambiente
  workerId: getWorkerId(),
};
