import { Injectable } from '@nestjs/common';
import { IdentityRepository } from '../repositories/identity.repository';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class LoginAttemptService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MINUTES = 30;

  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly logger: LoggerService,
  ) {}

  async recordFailedAttempt(identityId: string): Promise<void> {
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) return;

    identity.recordFailedAttempt();

    if (identity.shouldBlock(this.MAX_FAILED_ATTEMPTS)) {
      identity.block(this.BLOCK_DURATION_MINUTES);
      this.logger.warn(
        `Conta bloqueada: ${identityId}`,
        LoginAttemptService.name,
      );
    }

    await this.identityRepository.save(identity);
  }

  async resetAttempts(identityId: string): Promise<void> {
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) return;

    identity.resetAttempts();

    await this.identityRepository.save(identity);
  }
}
