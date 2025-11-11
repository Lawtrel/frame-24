import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { companies, Prisma, tax_regime_type } from '@repo/db';
import { Transactional } from '@nestjs-cls/transactional';

import { CompanyRepository } from '../repositories/company.repository';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { LoggerService } from 'src/common/services/logger.service';
import { BrasilApiService } from 'src/common/services/brasil-api.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly repository: CompanyRepository,
    private readonly brasilApiService: BrasilApiService,
    private readonly logger: LoggerService,
  ) {}

  @Transactional()
  async create(dto: CreateCompanyDto): Promise<companies> {
    this.logger.log(
      `Creating company: ${dto.corporate_name}`,
      CompanyService.name,
    );

    const exists = await this.repository.findByCnpj(dto.cnpj);
    if (exists) {
      throw new ConflictException(`CNPJ ${dto.cnpj} já cadastrado.`);
    }
    const cnpjData = await this.brasilApiService.getCnpjData(dto.cnpj);

    if (!cnpjData) {
      throw new NotFoundException(
        `CNPJ ${dto.cnpj} não encontrado na base de dados da Receita Federal.`,
      );
    }

    let determinedTaxRegime: tax_regime_type;

    if (cnpjData.opcao_pelo_simples === true) {
      determinedTaxRegime = tax_regime_type.SIMPLES_NACIONAL;
      this.logger.log(
        `CNPJ ${dto.cnpj} is SIMPLES_NACIONAL. Set automatically.`,
      );
    } else if (
      dto.tax_regime &&
      dto.tax_regime !== tax_regime_type.SIMPLES_NACIONAL
    ) {
      determinedTaxRegime = dto.tax_regime;
    } else {
      determinedTaxRegime = tax_regime_type.LUCRO_PRESUMIDO;
    }
    const tenant_slug = this.generateTenantSlug(dto.corporate_name, dto.cnpj);

    const data: Prisma.companiesCreateInput = {
      ...dto,
      tenant_slug,
      tax_regime: determinedTaxRegime,
      active: true,
    };

    const company = await this.repository.create(data);

    this.logger.log(`Company created: ${company.id}`, CompanyService.name);

    return company;
  }

  async findById(id: string): Promise<companies> {
    const company = await this.repository.findById(id);

    if (!company) {
      throw new NotFoundException(`Empresa ${id} não encontrada.`);
    }

    return company;
  }

  async findByCnpj(cnpj: string): Promise<companies | null> {
    return this.repository.findByCnpj(cnpj);
  }

  async findAll(skip = 0, take = 10): Promise<companies[]> {
    return this.repository.findAll(skip, take);
  }

  @Transactional()
  async update(id: string, dto: UpdateCompanyDto): Promise<companies> {
    await this.findById(id);

    this.logger.log(`Updating company: ${id}`, CompanyService.name);

    const data: Prisma.companiesUpdateInput = {
      ...dto,
      updated_at: new Date(),
    };

    const company = await this.repository.update(id, data);

    this.logger.log(`Company updated: ${id}`, CompanyService.name);

    return company;
  }

  @Transactional()
  async deactivate(id: string): Promise<companies> {
    await this.findById(id);

    this.logger.log(`Deactivating company: ${id}`, CompanyService.name);

    return this.repository.update(id, {
      active: false,
      updated_at: new Date(),
    });
  }

  @Transactional()
  async delete(id: string): Promise<companies> {
    await this.findById(id);

    this.logger.log(`Deleting company: ${id}`, CompanyService.name);

    return this.repository.delete(id);
  }

  private generateTenantSlug(corporateName: string, cnpj: string): string {
    const slug = corporateName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais
      .replace(/^-+|-+$/g, ''); // Remove hífens nas pontas

    // Adiciona sufixo único do CNPJ
    const suffix = cnpj.replace(/\D/g, '').slice(-4);
    return `${slug}-${suffix}`;
  }
}
