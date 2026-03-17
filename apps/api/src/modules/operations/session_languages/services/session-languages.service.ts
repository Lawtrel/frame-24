import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { SessionLanguageResponse } from '../../shared/dto/session-language-response.dto';
import { SessionLanguagesRepository } from '../repositories/session-languages.repository';

@Injectable()
export class SessionLanguagesService {
  constructor(
    private readonly repository: SessionLanguagesRepository,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  async findAll(): Promise<SessionLanguageResponse[]> {
    return this.repository.findAllByCompany(this.getCompanyId());
  }
}
