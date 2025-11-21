import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@repo/db';

import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly repository: SupplierRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateSupplierDto, company_id: string) {
    this.logger.log(
      `Creating supplier: ${dto.corporate_name}`,
      SuppliersService.name,
    );

    const normalizedCnpj = dto.cnpj.replace(/\D/g, '');

    if (normalizedCnpj) {
      const existing = await this.repository.findByCnpj(
        normalizedCnpj,
        company_id,
      );
      if (existing) {
        throw new ConflictException('CNPJ já cadastrado nesta empresa.');
      }
    }

    const data: Prisma.suppliersCreateInput = {
      company_id,

      ...(dto.supplier_type_id && {
        supplier_type: { connect: { id: dto.supplier_type_id } },
      }),

      corporate_name: dto.corporate_name,
      trade_name: dto.trade_name,
      cnpj: normalizedCnpj,
      phone: dto.phone?.replace(/\D/g, ''),
      email: dto.email,
      address: dto.address,
      contact_name: dto.contact_name,
      contact_phone: dto.contact_phone?.replace(/\D/g, ''),
      delivery_days: dto.delivery_days,
      is_film_distributor: dto.is_film_distributor || false,
      active: true,
    };

    const supplier = await this.repository.create(data);

    this.logger.log(`Supplier created: ${supplier.id}`, SuppliersService.name);

    return supplier;
  }

  async findAll(company_id: string, onlyDistributors = false) {
    this.logger.log(
      `Listing suppliers: company=${company_id}, onlyDistributors=${onlyDistributors}`,
      SuppliersService.name,
    );

    return this.repository.findByCompany(company_id, onlyDistributors);
  }

  async findOne(id: string, company_id: string) {
    const supplier = await this.repository.findById(id);

    if (!supplier || supplier.company_id !== company_id) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto, company_id: string) {
    await this.findOne(id, company_id);

    this.logger.log(`Updating supplier: ${id}`, SuppliersService.name);

    const data: Prisma.suppliersUpdateInput = {
      ...(dto.supplier_type_id && {
        supplier_type: { connect: { id: dto.supplier_type_id } },
      }),

      ...(dto.corporate_name !== undefined && {
        corporate_name: dto.corporate_name,
      }),
      ...(dto.trade_name !== undefined && { trade_name: dto.trade_name }),
      ...(dto.cnpj !== undefined && {
        cnpj: dto.cnpj.replace(/\D/g, ''),
      }),
      ...(dto.phone !== undefined && {
        phone: dto.phone.replace(/\D/g, ''),
      }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.contact_name !== undefined && {
        contact_name: dto.contact_name,
      }),
      ...(dto.contact_phone !== undefined && {
        contact_phone: dto.contact_phone.replace(/\D/g, ''),
      }),
      ...(dto.delivery_days !== undefined && {
        delivery_days: dto.delivery_days,
      }),
      ...(dto.is_film_distributor !== undefined && {
        is_film_distributor: dto.is_film_distributor,
      }),
      ...(dto.active !== undefined && { active: dto.active }),

      updated_at: new Date(),
    };

    const supplier = await this.repository.update(id, data);

    this.logger.log(`Supplier updated: ${id}`, SuppliersService.name);

    return supplier;
  }

  async delete(id: string, company_id: string) {
    await this.findOne(id, company_id);

    this.logger.log(`Deactivating supplier: ${id}`, SuppliersService.name);

    const supplier = await this.repository.softDelete(id);

    this.logger.log(`Supplier deactivated: ${id}`, SuppliersService.name);

    return supplier;
  }

  async findDistributors(company_id: string) {
    this.logger.log(
      `Listing film distributors: company=${company_id}`,
      SuppliersService.name,
    );

    return this.repository.findDistributors(company_id);
  }

  async findTypes(company_id: string) {
    this.logger.log(
      `Listing supplier types: company=${company_id}`,
      SuppliersService.name,
    );

    return this.repository.findTypes(company_id);
  }
}
