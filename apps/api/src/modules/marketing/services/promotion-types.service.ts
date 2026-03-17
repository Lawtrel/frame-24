import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { PromotionTypesRepository } from '../repositories/promotion-types.repository';
import { CreatePromotionTypeDto } from '../dto/create-promotion-type.dto';

@Injectable()
export class PromotionTypesService {
  constructor(
    private readonly promotionTypesRepository: PromotionTypesRepository,
    private readonly snowflake: SnowflakeService,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  async findAll() {
    const companyId = this.getCompanyId();
    return this.promotionTypesRepository.findAllByCompany(companyId);
  }

  async create(dto: CreatePromotionTypeDto) {
    const companyId = this.getCompanyId();
    const normalizedCode = dto.code.trim().toUpperCase();
    const existing = await this.promotionTypesRepository.findByCode(
      companyId,
      normalizedCode,
    );

    if (existing) {
      throw new BadRequestException('Código de tipo de promoção já utilizado');
    }

    return this.promotionTypesRepository.create({
      id: this.snowflake.generate(),
      company_id: companyId,
      code: normalizedCode,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      active: dto.active ?? true,
    });
  }
}
