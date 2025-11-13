import { Injectable, UnauthorizedException } from '@nestjs/common';
import { identity_type } from '@repo/db'; // ✅ Só o enum
import { Identity } from '../domain/entities/identity.entity'; // ✅ Entity
import { IdentityRepository } from '../repositories/identity.repository';
import { Password } from '../domain/value-objects/password.value-object';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class CredentialValidatorService {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly logger: LoggerService,
  ) {}

  async validate(
    email: string,
    plainPassword: string,
    companyId?: string,
  ): Promise<Identity> {
    const identity = await this.identityRepository.findByEmailAndCompany(
      email,
      companyId,
      'EMPLOYEE' as identity_type,
    );

    if (!identity) {
      this.logger.warn(
        `Credenciais inválidas para: ${email}`,
        CredentialValidatorService.name,
      );
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (!identity.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const password = Password.fromHash(identity.passwordHash);
    const isValid = await password.compare(plainPassword);

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return identity;
  }
}
