import { Injectable } from '@nestjs/common';
import { seat_types as SeatType } from '@repo/db';
import { SeatTypesRepository } from '../repositories/seat-types.repository';

@Injectable()
export class SeatTypesService {
  constructor(private readonly repository: SeatTypesRepository) {}

  async findAll(company_id: string): Promise<SeatType[]> {
    return this.repository.findAllByCompany(company_id);
  }
}
