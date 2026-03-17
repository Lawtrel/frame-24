import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { ProjectionTypesRepository } from '../repositories/projection-types.repository';

@Injectable()
export class ProjectionTypesService {
  constructor(
    private readonly repository: ProjectionTypesRepository,
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
