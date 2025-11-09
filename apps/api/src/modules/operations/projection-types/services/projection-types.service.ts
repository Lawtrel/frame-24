import { Injectable } from '@nestjs/common';
import { projection_types as ProjectionType } from '@repo/db';
import { ProjectionTypesRepository } from '../repositories/projection-types.repository';

@Injectable()
export class ProjectionTypesService {
  constructor(private readonly repository: ProjectionTypesRepository) {}

  async findAll(company_id: string): Promise<ProjectionType[]> {
    return this.repository.findAllByCompany(company_id);
  }
}
