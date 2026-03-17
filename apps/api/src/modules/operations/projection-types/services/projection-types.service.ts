import { Injectable } from '@nestjs/common';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { ProjectionTypesRepository } from '../repositories/projection-types.repository';

@Injectable()
export class ProjectionTypesService {
  constructor(private readonly repository: ProjectionTypesRepository) {}

  async findAll(companyId: string): Promise<OperationTypeResponse[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
