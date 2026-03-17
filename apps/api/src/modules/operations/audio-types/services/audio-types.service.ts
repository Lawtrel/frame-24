import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { OperationTypeResponse } from '../../shared/dto/operation-type-response.dto';
import { AudioTypesRepository } from '../repositories/audio-types.repository';

@Injectable()
export class AudioTypesService {
  constructor(
    private readonly repository: AudioTypesRepository,
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
