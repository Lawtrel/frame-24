import { Injectable } from '@nestjs/common';
import type { SeatStatusResponse } from '../../shared/dto/seat-status-response.dto';
import { SeatStatusRepository } from '../repositories/seat-status.repository';

@Injectable()
export class SeatStatusService {
  constructor(private readonly repository: SeatStatusRepository) {}

  async findAll(companyId: string): Promise<SeatStatusResponse[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
