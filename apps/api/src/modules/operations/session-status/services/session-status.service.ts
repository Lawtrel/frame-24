import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { SessionStatusResponse } from '../../shared/dto/session-status-response.dto';
import { SessionStatusRepository } from '../repositories/session-status.repository';

@Injectable()
export class SessionStatusService {
  constructor(
    private readonly repository: SessionStatusRepository,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  async findAll(): Promise<SessionStatusResponse[]> {
    return this.repository.findAllByCompany(this.getCompanyId());
  }
}
