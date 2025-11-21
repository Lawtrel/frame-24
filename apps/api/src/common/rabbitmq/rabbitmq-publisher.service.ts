import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Channel, ChannelModel, connect } from 'amqplib';
import { LoggerService } from '../services/logger.service';

export interface RabbitMQMessage<T = any> {
  pattern: string;
  data: T;
  metadata?: {
    userId?: string;
    companyId?: string;
    timestamp?: Date;
    correlationId?: string;
  };
}

@Injectable()
export class RabbitMQPublisherService implements OnModuleInit, OnModuleDestroy {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly logger = 'RabbitMQPublisher';
  private isConnecting = false;

  constructor(private loggerService: LoggerService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  private async connect(): Promise<void> {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const user = process.env.RABBITMQ_USER || 'frame24';
      const password = process.env.RABBITMQ_PASSWORD || 'frame24pass';
      const host = process.env.RABBITMQ_HOST || 'localhost';
      const port = process.env.RABBITMQ_PORT || 5672;
      const url = `amqp://${user}:${password}@${host}:${port}`;

      this.loggerService.log(
        `Connecting to RabbitMQ at ${host}:${port}...`,
        this.logger,
      );

      this.connection = await connect(url);

      this.connection.on('error', (err) => {
        this.loggerService.error(
          `Connection error: ${err.message}`,
          '',
          this.logger,
        );
        this.handleDisconnect();
      });

      this.connection.on('close', () => {
        this.loggerService.warn('Connection closed', this.logger);
        this.handleDisconnect();
      });

      this.channel = await this.connection.createChannel();

      this.channel.on('error', (err) => {
        this.loggerService.error(
          `Channel error: ${err.message}`,
          '',
          this.logger,
        );
      });

      this.channel.on('close', () => {
        this.loggerService.warn('Channel closed', this.logger);
        this.channel = null;
      });

      await this.channel.assertExchange('frame24-events', 'topic', {
        durable: true,
      });

      this.loggerService.log('Connected to RabbitMQ successfully', this.logger);
      this.isConnecting = false;
    } catch (error) {
      this.isConnecting = false;
      this.loggerService.error(
        `Failed to connect: ${(error as Error).message}`,
        '',
        this.logger,
      );
      // Retry after 5 seconds
      setTimeout(() => this.connect(), 5000);
    }
  }

  private handleDisconnect() {
    this.connection = null;
    this.channel = null;
    if (!this.isConnecting) {
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch {
      // Ignore errors during close
    }
  }

  async publish<T = any>(message: RabbitMQMessage<T>): Promise<void> {
    if (!this.channel) {
      this.loggerService.warn(
        'Channel not ready, attempting to reconnect...',
        this.logger,
      );
      await this.connect();
      if (!this.channel) {
        throw new Error('RabbitMQ channel is not available');
      }
    }

    const enrichedMessage = {
      ...message,
      metadata: {
        ...message.metadata,
        timestamp: message.metadata?.timestamp || new Date(),
        correlationId:
          message.metadata?.correlationId || this.generateCorrelationId(),
      },
    };

    try {
      const result = this.channel.publish(
        'frame24-events',
        message.pattern,
        Buffer.from(JSON.stringify(enrichedMessage)),
        { persistent: true },
      );

      if (!result) {
        this.loggerService.warn(
          'Message buffer full, message may be lost',
          this.logger,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `Failed to publish message: ${(error as Error).message}`,
        '',
        this.logger,
      );
      throw error;
    }
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
