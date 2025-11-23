import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { storageConfig } from './storage.config';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;

  constructor(private readonly cls: ClsService) {
    // Build endpoint URL
    const protocol = storageConfig.useSSL ? 'https' : 'http';
    const port = storageConfig.port;

    // Supabase uses a specific S3 endpoint path
    // Format: https://[project_ref].supabase.co/storage/v1/s3
    const isSupabase = storageConfig.endpoint.includes('supabase.co');
    const endpointPath = isSupabase ? '/storage/v1/s3' : '';

    // Only include port if it's not standard (80/443)
    const isStandardPort =
      (storageConfig.useSSL && port === 443) ||
      (!storageConfig.useSSL && port === 80);
    const portStr = isStandardPort ? '' : `:${port}`;

    const endpoint = `${protocol}://${storageConfig.endpoint}${portStr}${endpointPath}`;

    this.s3Client = new S3Client({
      endpoint,
      region: storageConfig.region || 'us-east-1',
      credentials: {
        accessKeyId: storageConfig.accessKey,
        secretAccessKey: storageConfig.secretKey,
      },
      forcePathStyle: true, // Required for MinIO and Supabase
    });

    this.logger.log(`Storage client initialized with endpoint: ${endpoint}`);
  }

  async onModuleInit() {
    try {
      await this.ensureBucket();
    } catch (error: any) {
      this.logger.warn(
        `Storage is not available: ${error.message}. File uploads will fail until storage is configured.`,
      );
    }
  }

  /**
   * Ensures the bucket exists, creates it if not (MinIO only)
   *
   * Note: Supabase Storage requires buckets to be created manually via dashboard.
   * This method will only attempt to create buckets in local MinIO environments.
   */
  private async ensureBucket(): Promise<void> {
    try {
      // Check if bucket exists
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: storageConfig.bucket }),
      );
      this.logger.log(`Bucket ${storageConfig.bucket} is accessible`);
    } catch (error: any) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        // Bucket doesn't exist

        // Only try to create bucket if using MinIO (typically localhost without SSL)
        const isMinIO =
          !storageConfig.useSSL &&
          (storageConfig.endpoint === 'localhost' ||
            storageConfig.endpoint.includes('127.0.0.1'));

        if (isMinIO) {
          try {
            await this.s3Client.send(
              new CreateBucketCommand({ Bucket: storageConfig.bucket }),
            );
            this.logger.log(
              `Bucket ${storageConfig.bucket} created successfully`,
            );
          } catch (createError: any) {
            this.logger.warn(
              `Could not create bucket ${storageConfig.bucket}: ${createError.message}`,
            );
          }
        } else {
          // Supabase or other S3 services - bucket must be pre-created
          this.logger.warn(
            `Bucket ${storageConfig.bucket} does not exist. ` +
              `For Supabase Storage, please create the bucket manually in the Supabase Dashboard. ` +
              `File uploads will fail until the bucket is created.`,
          );
        }
      } else {
        // Other error (permission, network, etc)
        this.logger.warn(
          `Unable to verify bucket ${storageConfig.bucket}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Uploads a file to S3-compatible storage
   * @param file - The file to upload
   * @param folder - The folder/module name (e.g., 'products', 'employees')
   * @returns The public URL of the uploaded file
   */
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const companyId = this.cls.get('companyId') || 'default';
    const timestamp = Date.now();
    const uuid = randomUUID();
    const extension = file.originalname.split('.').pop();
    const objectKey = `${companyId}/${folder}/${timestamp}-${uuid}.${extension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: storageConfig.bucket,
          Key: objectKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      this.logger.log(`File uploaded successfully: ${objectKey}`);

      // Return the public URL
      return this.getPublicUrl(objectKey);
    } catch (error: any) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a file from S3-compatible storage
   * @param fileUrl - The full URL or object key
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      // Extract object key from URL
      const objectKey = this.extractObjectKey(fileUrl);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: storageConfig.bucket,
          Key: objectKey,
        }),
      );
      this.logger.log(`File deleted successfully: ${objectKey}`);
    } catch (error: any) {
      this.logger.error(`Error deleting file: ${error.message}`);
      // Don't throw - deletion failures shouldn't break the flow
    }
  }

  /**
   * Gets a presigned URL for temporary access
   * @param objectKey - The object key in S3
   * @param expirySeconds - Expiry time in seconds (default: 1 hour)
   */
  async getPresignedUrl(
    objectKey: string,
    expirySeconds = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: storageConfig.bucket,
        Key: objectKey,
      });
      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expirySeconds,
      });
    } catch (error: any) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Constructs the public URL for an object
   *
   * Works with:
   * - Minio: http://localhost:9000/bucket/object
   * - Supabase: https://[project].supabase.co/storage/v1/object/public/bucket/object
   *
   * Set STORAGE_PUBLIC_URL in env to override URL generation
   */
  private getPublicUrl(objectKey: string): string {
    if (storageConfig.publicUrl) {
      // Ensure no trailing slash in publicUrl and no leading slash in objectKey
      const baseUrl = storageConfig.publicUrl.replace(/\/$/, '');
      const path = objectKey.replace(/^\//, '');
      return `${baseUrl}/${storageConfig.bucket}/${path}`;
    }

    const protocol = storageConfig.useSSL ? 'https' : 'http';
    // If port is standard (80 or 443), don't include it in the URL
    const isStandardPort =
      (storageConfig.useSSL && storageConfig.port === 443) ||
      (!storageConfig.useSSL && storageConfig.port === 80);
    const portStr = isStandardPort ? '' : `:${storageConfig.port}`;

    return `${protocol}://${storageConfig.endpoint}${portStr}/${storageConfig.bucket}/${objectKey}`;
  }

  /**
   * Extracts object key from a full URL
   */
  private extractObjectKey(fileUrl: string): string {
    // If it's already just an object key, return it
    if (!fileUrl.includes('://')) {
      return fileUrl;
    }

    // Extract from URL: http://localhost:9000/bucket/company-id/folder/file.jpg
    const parts = fileUrl.split(`/${storageConfig.bucket}/`);
    return parts[1] || fileUrl;
  }
}
