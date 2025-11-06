import { Injectable, OnModuleInit } from '@nestjs/common';
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

  constructor(private logger: LoggerService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const url = `amqp://${process.env.RABBITMQ_USER || 'frame24'}:${process.env.RABBITMQ_PASSWORD || 'frame24pass'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
      const connection = await amqplib.connect(url);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue('frame24_queue', { durable: true });
      this.logger.log('Connected to RabbitMQ', 'RabbitMQPublisher');
    } catch (error) {
      this.logger.error(`Failed to connect: ${error}`, '', 'RabbitMQPublisher');
    }
  }

  publish<T = any>(message: RabbitMQMessage<T>): void {
    if (!this.channel) {
      this.logger.error('Channel not ready', '', 'RabbitMQPublisher');
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

    this.channel.sendToQueue(
      'frame24_queue',
      Buffer.from(JSON.stringify(enrichedMessage)),
      { persistent: true },
    );

    this.logger.log(
      `Message published: ${message.pattern}`,
      'RabbitMQPublisher',
    );
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
