import { Injectable } from '@nestjs/common';
import { audio_types as AudioType } from '@repo/db';
import { AudioTypesRepository } from '../repositories/audio-types.repository';

@Injectable()
export class AudioTypesService {
  constructor(private readonly repository: AudioTypesRepository) {}

  async findAll(company_id: string): Promise<AudioType[]> {
    return this.repository.findAllByCompany(company_id);
  }
}
