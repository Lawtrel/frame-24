import { assertNotInsecure, requireEnv } from './env.util';

export function validateEnvironment(): void {
  const jwtSecret = requireEnv('JWT_SECRET', 'test-jwt-secret');
  assertNotInsecure('JWT_SECRET', jwtSecret, [
    'dev_secret',
    'frame24-super-secret-jwt-key-2024',
    'changeme',
    'secret',
    '123456',
  ]);

  // RabbitMQ: either full URI or connection parts are required.
  const rabbitUri = process.env.RABBITMQ_URI;
  if (!rabbitUri) {
    requireEnv('RABBITMQ_USER', 'test');
    requireEnv('RABBITMQ_PASSWORD', 'test');
    requireEnv('RABBITMQ_HOST', 'localhost');
    requireEnv('RABBITMQ_PORT', '5672');
  }

  // Storage credentials should never rely on hardcoded defaults.
  const minioAccessKey = requireEnv('MINIO_ACCESS_KEY', 'test');
  const minioSecretKey = requireEnv('MINIO_SECRET_KEY', 'test');
  assertNotInsecure('MINIO_ACCESS_KEY', minioAccessKey, ['minioadmin']);
  assertNotInsecure('MINIO_SECRET_KEY', minioSecretKey, [
    'minioadmin',
    'frame24pass',
  ]);
}

