import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractTypesRepository } from '../repositories/contract-types.repository';
import { CreateContractTypeDto } from '../dto/create-contract-type.dto';
import { UpdateContractTypeDto } from '../dto/update-contract-type.dto';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { contract_types } from '@repo/db';

@Injectable()
export class ContractTypesService {
  constructor(
    private readonly repository: ContractTypesRepository,
    private readonly snowflake: SnowflakeService,
  ) {}

  async create(
    companyId: string,
    dto: CreateContractTypeDto,
  ): Promise<contract_types> {
    return this.repository.create({
      id: this.snowflake.generate(),
      company_id: companyId,
      name: dto.name,
      description: dto.description,
      created_at: new Date(),
    });
  }

  async findAll(companyId: string): Promise<contract_types[]> {
    return this.repository.findAllByCompany(companyId);
  }

  async findOne(companyId: string, id: string): Promise<contract_types> {
    const type = await this.repository.findById(id);
    if (!type || type.company_id !== companyId) {
      throw new NotFoundException('Tipo de contrato não encontrado.');
    }
    return type;
  }

  async update(
    companyId: string,
    id: string,
    dto: UpdateContractTypeDto,
  ): Promise<contract_types> {
    await this.findOne(companyId, id);

    return this.repository.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
    });
  }

  async delete(companyId: string, id: string): Promise<void> {
    await this.findOne(companyId, id);
    await this.repository.delete(id);
  }
}
