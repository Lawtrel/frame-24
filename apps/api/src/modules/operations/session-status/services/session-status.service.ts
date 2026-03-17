import { Injectable } from '@nestjs/common';
import type { SessionStatusResponse } from '../../shared/dto/session-status-response.dto';
import { SessionStatusRepository } from '../repositories/session-status.repository';

@Injectable()
export class SessionStatusService {
  constructor(private readonly repository: SessionStatusRepository) {}

  async findAll(companyId: string): Promise<SessionStatusResponse[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
