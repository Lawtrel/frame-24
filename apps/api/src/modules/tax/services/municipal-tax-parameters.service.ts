import { Injectable, NotFoundException } from '@nestjs/common';
import { municipal_tax_parameters, Prisma } from '@repo/db';
import { MunicipalTaxParametersRepository } from '../repositories/municipal-tax-parameters.repository';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CreateMunicipalTaxParameterDto } from '../dto/create-municipal-tax-parameter.dto';
import { UpdateMunicipalTaxParameterDto } from '../dto/update-municipal-tax-parameter.dto';

@Injectable()
export class MunicipalTaxParametersService {
  constructor(
    private readonly repository: MunicipalTaxParametersRepository,
    private readonly snowflake: SnowflakeService,
  ) {}

  async create(
    companyId: string,
    data: CreateMunicipalTaxParameterDto,
  ): Promise<municipal_tax_parameters> {
    const payload: Prisma.municipal_tax_parametersCreateInput = {
      id: this.snowflake.generate(),
      company_id: companyId,
      ibge_municipality_code: data.ibge_municipality_code,
      municipality_name: data.municipality_name,
      state: data.state,
      iss_rate: data.iss_rate,
      ...(data.iss_service_code && {
        iss_service_code: data.iss_service_code,
      }),
      iss_concession_applicable: data.iss_concession_applicable ?? false,
      ...(data.iss_concession_service_code && {
        iss_concession_service_code: data.iss_concession_service_code,
      }),
      iss_withholding: data.iss_withholding ?? false,
      validity_start: data.validity_start,
      ...(data.validity_end && { validity_end: data.validity_end }),
      notes: data.notes,
      active: data.active ?? true,
    };

    return this.repository.create(payload);
  }

  async listByCompany(companyId: string): Promise<municipal_tax_parameters[]> {
    return this.repository.findAllByCompany(companyId);
  }

  async findById(
    companyId: string,
    id: string,
  ): Promise<municipal_tax_parameters> {
    const record = await this.repository.findById(id);

    if (!record || record.company_id !== companyId) {
      throw new NotFoundException('Parâmetro municipal não encontrado.');
    }

    return record;
  }

  async update(
    companyId: string,
    id: string,
    dto: UpdateMunicipalTaxParameterDto,
  ): Promise<municipal_tax_parameters> {
    await this.findById(companyId, id);

    const payload: Prisma.municipal_tax_parametersUpdateInput = {
      ...(dto.ibge_municipality_code && {
        ibge_municipality_code: dto.ibge_municipality_code,
      }),
      ...(dto.municipality_name && {
        municipality_name: dto.municipality_name,
      }),
      ...(dto.state && { state: dto.state }),
      ...(dto.iss_rate !== undefined && { iss_rate: dto.iss_rate }),
      ...(dto.iss_service_code !== undefined && {
        iss_service_code: dto.iss_service_code,
      }),
      ...(dto.iss_concession_applicable !== undefined && {
        iss_concession_applicable: dto.iss_concession_applicable,
      }),
      ...(dto.iss_concession_service_code !== undefined && {
        iss_concession_service_code: dto.iss_concession_service_code,
      }),
      ...(dto.iss_withholding !== undefined && {
        iss_withholding: dto.iss_withholding,
      }),
      ...(dto.validity_start && { validity_start: dto.validity_start }),
      ...(dto.validity_end !== undefined && {
        validity_end: dto.validity_end ?? null,
      }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.active !== undefined && { active: dto.active }),
    };

    return this.repository.update(id, payload);
  }

  async delete(companyId: string, id: string): Promise<void> {
    await this.findById(companyId, id);
    await this.repository.delete(id);
  }
}
