import { Injectable, BadRequestException } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import * as crypto from 'crypto';
import { Identity } from '../domain/entities/identity.entity';
import { Person } from '../domain/entities/person.entity';
import { IdentityRepository } from '../repositories/identity.repository';
import { PersonRepository } from '../repositories/person.repository';
import { Password } from '../domain/value-objects/password.value-object';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly personRepository: PersonRepository,
    private readonly logger: LoggerService,
  ) { }

  @Transactional()
  async requestReset(
    email: string,
  ): Promise<{ token: string; identity: Identity; person: Person } | null> {
    const identity = await this.identityRepository.findByEmail(email);

    if (!identity || !identity.active || !identity.personId) {
      this.logger.warn(
        `Solicitação de reset para conta inexistente/inativa: ${email}`,
        PasswordResetService.name,
      );
      return null;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.identityRepository.updatePasswordReset(identity.id, {
      resetToken,
      resetTokenExpiresAt: expiresAt,
    });

    const person = await this.personRepository.findById(identity.personId);
    if (!person) {
      this.logger.error(
        `Pessoa não encontrada para identity ${identity.id}`,
        PasswordResetService.name,
      );
      return null;
    }

    this.logger.log(
      `Reset de senha solicitado: ${email}`,
      PasswordResetService.name,
    );

    return { token: resetToken, identity, person };
  }

  @Transactional()
  async resetPassword(
    token: string,
    newPlainPassword: string,
  ): Promise<Identity> {
    const identity =
      await this.identityRepository.findByPasswordResetToken(token);

    if (
      !identity ||
      !identity.resetTokenExpiresAt ||
      identity.resetTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException(
        'Token de redefinição inválido ou expirado.',
      );
    }

    const password = await Password.create(newPlainPassword);

    const updatedIdentity =
      await this.identityRepository.completePasswordReset(identity.id, {
        passwordHash: password.hash,
        passwordChangedAt: new Date(),
      });

    this.logger.log(
      `Senha redefinida com sucesso: ${identity.id}`,
      PasswordResetService.name,
    );

    return updatedIdentity;
  }
}
