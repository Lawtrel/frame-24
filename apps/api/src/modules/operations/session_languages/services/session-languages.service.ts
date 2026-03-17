import { Injectable } from '@nestjs/common';
import type { SessionLanguageResponse } from '../../shared/dto/session-language-response.dto';
import { SessionLanguagesRepository } from '../repositories/session-languages.repository';

@Injectable()
export class SessionLanguagesService {
  constructor(private readonly repository: SessionLanguagesRepository) {}

  async findAll(companyId: string): Promise<SessionLanguageResponse[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
