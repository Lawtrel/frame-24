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
        `Failed to connect: ${error}`,
        '',
        'RabbitMQPublisher',
      );
    }
  }

  publish<T = any>(message: RabbitMQMessage<T>): void {
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

    this.channel.publish(
      'frame24-events',
      message.pattern,
      Buffer.from(JSON.stringify(enrichedMessage)),
      { persistent: true },
    );

    this.loggerService.log(
      `Message published: ${message.pattern}`,
      'RabbitMQPublisher',
    );
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
