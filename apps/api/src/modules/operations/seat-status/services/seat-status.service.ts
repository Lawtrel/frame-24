import { Injectable } from '@nestjs/common';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { SeatStatusRepository } from '../repositories/seat-status.repository';

@Injectable()
export class SeatStatusService {
  constructor(private readonly repository: SeatStatusRepository) {}

  async findAll(user: RequestUser) {
    return this.repository.findAllByCompany(user.company_id);
  }
}
