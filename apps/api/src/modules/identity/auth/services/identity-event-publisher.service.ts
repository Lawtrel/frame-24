import { Injectable } from '@nestjs/common';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import {
  IdentityCreatedEventData,
  IdentityEventPattern,
  IdentityVerifiedEventData,
  PasswordResetEventData,
} from 'src/modules/identity/events/identity.events';

@Injectable()
export class IdentityEventPublisherService {
  constructor(private readonly rabbitmq: RabbitMQPublisherService) {}

  async publishCreated(data: {
    identityId: string;
    email: string;
    fullName: string;
    verificationToken: string;
  }): Promise<void> {
    await this.rabbitmq.publish<IdentityCreatedEventData>({
      pattern: IdentityEventPattern.CREATED,
      data: {
        identity_id: data.identityId,
        email: data.email,
        full_name: data.fullName,
        verification_token: data.verificationToken,
      },
      metadata: {
        correlationId: this.generateCorrelationId(),
      },
    });
  }

  async publishVerified(data: {
    identityId: string;
    email: string;
    fullName: string;
  }): Promise<void> {
    await this.rabbitmq.publish<IdentityVerifiedEventData>({
      pattern: IdentityEventPattern.VERIFIED,
      data: {
        identity_id: data.identityId,
        email: data.email,
        full_name: data.fullName,
      },
      metadata: {
        correlationId: this.generateCorrelationId(),
      },
    });
  }

  async publishPasswordReset(data: {
    identityId: string;
    email: string;
    fullName: string;
    resetToken: string;
  }): Promise<void> {
    await this.rabbitmq.publish<PasswordResetEventData>({
      pattern: IdentityEventPattern.PASSWORD_RESET,
      data: {
        identity_id: data.identityId,
        email: data.email,
        full_name: data.fullName,
        reset_token: data.resetToken,
      },
      metadata: {
        correlationId: this.generateCorrelationId(),
      },
    });
  }

  generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
