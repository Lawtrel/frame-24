import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import * as Minio from 'minio';
import { storageConfig } from './storage.config';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client;

  constructor(private readonly cls: ClsService) {
    this.minioClient = new Minio.Client({
      endPoint: storageConfig.endpoint,
      port: storageConfig.port,
      useSSL: storageConfig.useSSL,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey,
      region: storageConfig.region,
    });
  }

  async onModuleInit() {
    try {
      await this.ensureBucket();
    } catch (error: any) {
      this.logger.warn(
        `MinIO is not available: ${error.message}. File uploads will fail until MinIO is configured.`,
      );
    }
  }

  /**
   * Ensures the bucket exists, creates it if not
   */
  private async ensureBucket(): Promise<void> {
    const exists = await this.minioClient.bucketExists(storageConfig.bucket);
    if (!exists) {
      await this.minioClient.makeBucket(
        storageConfig.bucket,
        storageConfig.region,
      );
      this.logger.log(`Bucket ${storageConfig.bucket} created successfully`);
    } else {
      this.logger.log(`Bucket ${storageConfig.bucket} already exists`);
    }
  }

  /**
   * Uploads a file to MinIO
   * @param file - The file to upload
   * @param folder - The folder/module name (e.g., 'products', 'employees')
   * @returns The public URL of the uploaded file
   */
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const companyId = this.cls.get('companyId') || 'default';
    const timestamp = Date.now();
    const uuid = randomUUID();
    const extension = file.originalname.split('.').pop();
    const objectName = `${companyId}/${folder}/${timestamp}-${uuid}.${extension}`;

    try {
      await this.minioClient.putObject(
        storageConfig.bucket,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      this.logger.log(`File uploaded successfully: ${objectName}`);

      // Return the public URL
      return this.getPublicUrl(objectName);
    } catch (error: any) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a file from MinIO
   * @param fileUrl - The full URL or object name
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      // Extract object name from URL
      const objectName = this.extractObjectName(fileUrl);
      await this.minioClient.removeObject(storageConfig.bucket, objectName);
      this.logger.log(`File deleted successfully: ${objectName}`);
    } catch (error: any) {
      this.logger.error(`Error deleting file: ${error.message}`);
      // Don't throw - deletion failures shouldn't break the flow
    }
  }

  /**
   * Gets a presigned URL for temporary access
   * @param objectName - The object name in MinIO
   * @param expirySeconds - Expiry time in seconds (default: 1 hour)
   */
  async getPresignedUrl(
    objectName: string,
    expirySeconds = 3600,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        storageConfig.bucket,
        objectName,
        expirySeconds,
      );
    } catch (error: any) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Constructs the public URL for an object
   */
  private getPublicUrl(objectName: string): string {
    if (storageConfig.publicUrl) {
      // Ensure no trailing slash in publicUrl and no leading slash in objectName
      const baseUrl = storageConfig.publicUrl.replace(/\/$/, '');
      const path = objectName.replace(/^\//, '');
      return `${baseUrl}/${storageConfig.bucket}/${path}`;
    }

    const protocol = storageConfig.useSSL ? 'https' : 'http';
    // If port is standard (80 or 443), don't include it in the URL
    const isStandardPort =
      (storageConfig.useSSL && storageConfig.port === 443) ||
      (!storageConfig.useSSL && storageConfig.port === 80);
    const portStr = isStandardPort ? '' : `:${storageConfig.port}`;

    return `${protocol}://${storageConfig.endpoint}${portStr}/${storageConfig.bucket}/${objectName}`;
  }

  /**
   * Extracts object name from a full URL
   */
  private extractObjectName(fileUrl: string): string {
    // If it's already just an object name, return it
    if (!fileUrl.includes('://')) {
      return fileUrl;
    }

    // Extract from URL: http://localhost:9000/bucket/company-id/folder/file.jpg
    const parts = fileUrl.split(`/${storageConfig.bucket}/`);
    return parts[1] || fileUrl;
  }
}
