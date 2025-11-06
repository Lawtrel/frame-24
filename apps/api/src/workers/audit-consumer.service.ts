import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';
import { AuditWorkerService } from './audit-worker.service';

interface AuditMessage {
  pattern: string;
  data: {
    id?: string;
    old_values?: unknown;
    new_values?: unknown;
    [key: string]: unknown;
  };
  metadata?: {
    userId?: string;
    companyId?: string;
    correlationId?: string;
    timestamp?: string;
  };
}

@Injectable()
export class AuditConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AuditConsumer');
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private auditWorker: AuditWorkerService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Iniciando consumer...');
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  private async connect(): Promise<void> {
    try {
      const url = 'amqp://frame24:frame24pass@localhost:5672';
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('frame24_queue', { durable: true });

      this.logger.log('Conectado! Escutando fila...');

      await this.channel.consume(
        'frame24_queue',
        (msg: ConsumeMessage | null) => {
          if (!msg) return;

          this.processMessage(msg).catch((error) => {
            this.logger.error(
              `Erro ao processar: ${error instanceof Error ? error.message : 'Unknown'}`,
              error instanceof Error ? error.stack : '',
            );
            this.channel?.nack(msg, false, false);
          });
        },
      );
    } catch (error) {
      this.logger.error(
        `Conexão falhou: ${error instanceof Error ? error.message : String(error)}`,
      );

      setTimeout(() => {
        this.connect().catch((err) => {
          this.logger.error(
            'Reconnect failed',
            err instanceof Error ? err.stack : '',
          );
        });
      }, 5000);
    }
  }

  private async processMessage(msg: ConsumeMessage): Promise<void> {
    const content = JSON.parse(msg.content.toString()) as AuditMessage;
    this.logger.log(`Recebido: ${content.pattern}`);

    if (content.pattern?.startsWith('audit.')) {
      await this.auditWorker.handleAuditEvent(content);
      this.logger.log(`Processado: ${content.pattern}`);
    }

    this.channel?.ack(msg);
  }
}
