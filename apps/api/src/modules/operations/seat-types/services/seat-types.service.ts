import { Injectable } from '@nestjs/common';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { SeatTypesRepository } from '../repositories/seat-types.repository';

@Injectable()
export class SeatTypesService {
  constructor(private readonly repository: SeatTypesRepository) {}

  async findAll(companyId: string): Promise<OperationTypeResponse[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
