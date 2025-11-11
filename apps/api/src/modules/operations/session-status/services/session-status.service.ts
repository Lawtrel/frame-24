import { Injectable } from '@nestjs/common';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { SessionStatusRepository } from '../repositories/session-status.repository';

@Injectable()
export class SessionStatusService {
  constructor(private readonly repository: SessionStatusRepository) {}

  async findAll(user: RequestUser) {
    return this.repository.findAllByCompany(user.company_id);
  }
}
