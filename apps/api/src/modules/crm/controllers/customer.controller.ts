import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerGuard } from 'src/common/guards/customer.guard';
import { CurrentCustomer } from 'src/common/decorators/current-customer.decorator';
import type { CustomerUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { CustomersRepository } from '../repositories/customers.repository';
import { CompanyCustomersRepository } from '../repositories/company-customers.repository';
import { UpdateCustomerProfileDto } from '../dto/update-customer-profile.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller({ path: 'customer', version: '1' })
@UseGuards(JwtAuthGuard, CustomerGuard)
export class CustomerController {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly companyCustomersRepository: CompanyCustomersRepository,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Obter perfil do cliente',
    description: 'Retorna os dados do cliente autenticado',
  })
  async getProfile(@CurrentCustomer() customer: CustomerUser) {
    const customerData = await this.customersRepository.findById(
      customer.customer_id,
    );

    if (!customerData) {
      throw new Error('Cliente não encontrado');
    }

    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        customer.company_id,
        customer.customer_id,
      );

    return {
      id: customerData.id,
      email: customerData.email,
      full_name: customerData.full_name,
      phone: customerData.phone,
      birth_date: customerData.birth_date,
      loyalty_level: companyCustomer?.loyalty_level || 'BRONZE',
      accumulated_points: companyCustomer?.accumulated_points || 0,
      company_id: customer.company_id,
      tenant_slug: customer.tenant_slug,
    };
  }

  @Get('points')
  @ApiOperation({
    summary: 'Obter pontos de fidelidade',
    description: 'Retorna os pontos acumulados do cliente',
  })
  async getPoints(@CurrentCustomer() customer: CustomerUser) {
    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        customer.company_id,
        customer.customer_id,
      );

    return {
      accumulated_points: companyCustomer?.accumulated_points || 0,
      loyalty_level: companyCustomer?.loyalty_level || 'BRONZE',
    };
  }

  @Put('profile')
  @ApiOperation({
    summary: 'Atualizar perfil do cliente',
    description: 'Permite que o cliente atualize seus próprios dados básicos',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
  })
  async updateProfile(
    @CurrentCustomer() customer: CustomerUser,
    @Body() dto: UpdateCustomerProfileDto,
  ) {
    const customerData = await this.customersRepository.findById(
      customer.customer_id,
    );

    if (!customerData) {
      throw new Error('Cliente não encontrado');
    }

    const updateData: any = {};

    if (dto.full_name !== undefined) {
      updateData.full_name = dto.full_name;
    }

    if (dto.phone !== undefined) {
      updateData.phone = dto.phone;
    }

    if (dto.birth_date !== undefined) {
      updateData.birth_date = dto.birth_date ? new Date(dto.birth_date) : null;
    }

    const updated = await this.customersRepository.update(
      customer.customer_id,
      updateData,
    );

    return {
      id: updated.id,
      email: updated.email,
      full_name: updated.full_name,
      phone: updated.phone,
      birth_date: updated.birth_date,
    };
  }
}
