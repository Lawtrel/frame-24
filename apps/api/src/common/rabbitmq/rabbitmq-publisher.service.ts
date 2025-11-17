import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqplib from 'amqplib';
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
export class RabbitMQPublisherService implements OnModuleInit {
  private channel: amqplib.Channel | null = null;
  private readonly logger = new Logger('RabbitMQPublisher');

  constructor(private loggerService: LoggerService) {}
  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const url = `amqp://${process.env.RABBITMQ_USER || 'frame24'}:${process.env.RABBITMQ_PASSWORD || 'frame24pass'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
      const connection = await amqplib.connect(url);
      this.channel = await connection.createChannel();

      await this.channel.assertExchange('frame24-events', 'topic', {
        durable: true,
      });
      this.loggerService.log('Connected to RabbitMQ', 'RabbitMQPublisher');
    } catch (error) {
      this.loggerService.error(
        `Failed to connect: ${(error as Error).message}`,
        '',
        'RabbitMQPublisher',
      );
    }
  }

  async publish<T = any>(message: RabbitMQMessage<T>): Promise<void> {
    if (!this.channel) {
      this.loggerService.error('Channel not ready', '', 'RabbitMQPublisher');
      return;
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

    await new Promise<void>((resolve, reject) => {
      if (!this.channel) {
        reject(new Error('Channel not initialized'));
        return;
      }

      const result = this.channel.publish(
        'frame24-events',
        message.pattern,
        Buffer.from(JSON.stringify(enrichedMessage)),
        { persistent: true },
      );

      if (!result) {
        reject(new Error('Failed to publish message'));
        return;
      }

      this.channel.on('error', (err: Error) => {
        if (err) {
          this.loggerService.error(
            `Failed to publish message: ${err.message}`,
            '',
            'RabbitMQPublisher',
          );
          reject(new Error(err.message || 'Unknown error'));
        }
      });

      resolve();
    });
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
