import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Identity } from '../domain/entities/identity.entity';

@Injectable()
export class AccountStatusCheckerService {
  check(identity: Identity): void {
    if (!identity.canLogin()) {
      this.throwAppropriateError(identity);
    }
  }

  private throwAppropriateError(identity: Identity): never {
    if (identity.isBlocked()) {
      throw new UnauthorizedException(
        `Conta bloqueada até ${identity.blockedUntil?.toISOString()}.`,
      );
    }

    if (!identity.active) {
      throw new UnauthorizedException('Conta desativada.');
    }

    if (!identity.emailVerified) {
      throw new UnauthorizedException(
        'Email não verificado. Por favor, verifique seu email antes de fazer login.',
      );
    }

    throw new UnauthorizedException('Não autorizado.');
  }
}
