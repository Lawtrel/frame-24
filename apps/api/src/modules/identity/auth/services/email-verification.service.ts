import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import * as crypto from 'crypto';
import { Identity } from '../domain/entities/identity.entity';
import { Person } from '../domain/entities/person.entity';
import { IdentityRepository } from '../repositories/identity.repository';
import { PersonRepository } from '../repositories/person.repository';
import { LoggerService } from 'src/common/services/logger.service';

export interface VerificationToken {
  token: string;
  expiresAt: Date;
}

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly personRepository: PersonRepository,
    private readonly logger: LoggerService,
  ) {}

  generateToken(): VerificationToken {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return { token, expiresAt };
  }

  @Transactional()
  async verifyEmail(
    token: string,
  ): Promise<{ identity: Identity; person: Person }> {
    const identity =
      await this.identityRepository.findByVerificationToken(token);

    if (
      !identity ||
      !identity.emailVerificationExpiresAt ||
      identity.emailVerificationExpiresAt < new Date()
    ) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    if (identity.emailVerified) {
      throw new BadRequestException('Email já verificado');
    }

    if (!identity.personId) {
      throw new NotFoundException(
        'Dados de usuário inconsistentes. Contate o suporte.',
      );
    }

    const person = await this.personRepository.findById(identity.personId);
    if (!person) {
      throw new NotFoundException(
        'Dados de usuário associados não encontrados.',
      );
    }

    await this.identityRepository.updateEmailVerification(identity.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    });

    this.logger.log(
      `Email verificado: ${identity.email}`,
      EmailVerificationService.name,
    );

    return { identity, person };
  }
}
