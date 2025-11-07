import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';
import { EmailService } from '../services/email.service';
import {
  IdentityCreatedEventData,
  IdentityEventPattern,
  IdentityVerifiedEventData,
  PasswordResetEventData,
} from 'src/modules/identity/events/identity.events';

interface IdentityMessage {
  pattern: string;
  data: IdentityCreatedEventData | IdentityVerifiedEventData;
  metadata?: {
    userId?: string;
    companyId?: string;
    correlationId?: string;
    timestamp?: string;
  };
}

@Injectable()
export class IdentityEmailConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('IdentityEmailConsumer');
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private emailService: EmailService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Iniciando consumer de emails...');
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.logger.log('Consumer desconectado');
  }

  private async connect(): Promise<void> {
    try {
      const url = `amqp://${process.env.RABBITMQ_USER || 'frame24'}:${process.env.RABBITMQ_PASSWORD || 'frame24pass'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;

      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('frame24-events', 'topic', {
        durable: true,
      });

      await this.channel.assertQueue('email-queue', { durable: true });

      await this.channel.bindQueue(
        'email-queue',
        'frame24-events',
        'identity.#',
      );
      this.logger.log('Conectado ao RabbitMQ! Escutando mensagens...');

      await this.channel.consume(
        'email-queue',
        (msg: ConsumeMessage | null) => {
          if (!msg) return;

          this.processMessage(msg).catch((error) => {
            this.logger.error(
              `Erro ao processar mensagem: ${error instanceof Error ? error.message : 'Unknown'}`,
              error instanceof Error ? error.stack : '',
            );
            this.channel?.nack(msg, false, false);
          });
        },
      );
    } catch (error) {
      this.logger.error(
        `Falha na conexão RabbitMQ: ${error instanceof Error ? error.message : String(error)}`,
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
    try {
      const content = JSON.parse(msg.content.toString()) as IdentityMessage;
      this.logger.log(`Recebido: ${content.pattern}`);

      if (content.pattern?.startsWith('identity.')) {
        await this.handleIdentityEvent(content);
        this.logger.log(`Processado: ${content.pattern}`);
      }

      this.channel?.ack(msg);
    } catch (error) {
      this.logger.error(
        `Erro ao processar mensagem: ${error instanceof Error ? error.message : 'Unknown'}`,
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }

  private async handleIdentityEvent(message: IdentityMessage): Promise<void> {
    switch (message.pattern) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case IdentityEventPattern.CREATED:
        await this.handleIdentityCreated(
          message.data as IdentityCreatedEventData,
        );
        break;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case IdentityEventPattern.VERIFIED:
        await this.handleIdentityVerified(
          message.data as IdentityVerifiedEventData,
        );
        break;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case IdentityEventPattern.PASSWORD_RESET:
        await this.handlePasswordReset(message.data as PasswordResetEventData);
        break;
      default:
        this.logger.warn(`Padrão desconhecido: ${message.pattern}`);
    }
  }

  private async handleIdentityCreated(
    data: IdentityCreatedEventData,
  ): Promise<void> {
    this.logger.log(`Processando identity.created: ${data.email}`);

    await this.emailService.sendVerificationEmail(
      data.email,
      data.full_name,
      data.verification_token,
    );

    this.logger.log(`Email de verificação enviado para: ${data.email}`);
  }

  private async handleIdentityVerified(
    data: IdentityVerifiedEventData,
  ): Promise<void> {
    this.logger.log(`Processando identity.verified: ${data.email}`);

    await this.emailService.sendWelcomeEmail(data.email, data.full_name);

    this.logger.log(`Email de boas-vindas enviado para: ${data.email}`);
  }

  private async handlePasswordReset(
    data: PasswordResetEventData,
  ): Promise<void> {
    this.logger.log(`Processando identity.password_reset: ${data.email}`);

    await this.emailService.sendPasswordResetEmail(
      data.email,
      data.full_name,
      data.reset_token,
    );

    this.logger.log(
      `Email de redefinição de senha enviado para: ${data.email}`,
    );
  }
}
