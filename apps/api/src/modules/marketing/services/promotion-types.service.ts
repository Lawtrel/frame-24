import { BadRequestException, Injectable } from '@nestjs/common';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { PromotionTypesRepository } from '../repositories/promotion-types.repository';
import { CreatePromotionTypeDto } from '../dto/create-promotion-type.dto';

@Injectable()
export class PromotionTypesService {
  constructor(
    private readonly promotionTypesRepository: PromotionTypesRepository,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findAll(company_id: string) {
    return this.promotionTypesRepository.findAllByCompany(company_id);
  }

  async create(company_id: string, dto: CreatePromotionTypeDto) {
    const normalizedCode = dto.code.trim().toUpperCase();
    const existing = await this.promotionTypesRepository.findByCode(
      company_id,
      normalizedCode,
    );

    if (existing) {
      throw new BadRequestException('Código de tipo de promoção já utilizado');
    }

    return this.promotionTypesRepository.create({
      id: this.snowflake.generate(),
      company_id,
      code: normalizedCode,
      name: dto.name.trim(),
      description: dto.description,
      active: dto.active ?? true,
    });
  }
}

