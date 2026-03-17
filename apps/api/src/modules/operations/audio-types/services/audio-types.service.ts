import { Injectable } from '@nestjs/common';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { AudioTypesRepository } from '../repositories/audio-types.repository';

@Injectable()
export class AudioTypesService {
  constructor(private readonly repository: AudioTypesRepository) {}

  async findAll(companyId: string): Promise<OperationTypeResponse[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
