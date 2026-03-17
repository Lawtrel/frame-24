import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { SeatStatusResponse } from '../../shared/dto/seat-status-response.dto';
import { SeatStatusRepository } from '../repositories/seat-status.repository';

@Injectable()
export class SeatStatusService {
  constructor(
    private readonly repository: SeatStatusRepository,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  async findAll(): Promise<SeatStatusResponse[]> {
    return this.repository.findAllByCompany(this.getCompanyId());
  }
}
