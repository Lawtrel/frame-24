import { requireEnv } from 'src/config/env.util';

export interface StorageConfig {
  endpoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  useSSL: boolean;
  bucket: string;
  region?: string;
  publicUrl?: string;
}

export const storageConfig: StorageConfig = {
  endpoint: requireEnv('MINIO_ENDPOINT', 'localhost'),
  port: parseInt(requireEnv('MINIO_PORT', '9000'), 10),
  accessKey: requireEnv('MINIO_ACCESS_KEY', 'test'),
  secretKey: requireEnv('MINIO_SECRET_KEY', 'test'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  bucket: requireEnv('MINIO_BUCKET', 'frame24-uploads'),
  region: process.env.MINIO_REGION,
  publicUrl: process.env.STORAGE_PUBLIC_URL ?? process.env.MINIO_PUBLIC_URL,
};
