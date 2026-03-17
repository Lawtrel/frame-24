import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { SeatTypesRepository } from '../repositories/seat-types.repository';

@Injectable()
export class SeatTypesService {
  constructor(
    private readonly repository: SeatTypesRepository,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  async findAll(): Promise<OperationTypeResponse[]> {
    return this.repository.findAllByCompany(this.getCompanyId());
  }
}
