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
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  useSSL: process.env.MINIO_USE_SSL === 'true',
  bucket: process.env.MINIO_BUCKET || 'frame24-uploads',
  region: process.env.MINIO_REGION,
  publicUrl: process.env.STORAGE_PUBLIC_URL,
};
