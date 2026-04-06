import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerGuard } from 'src/common/guards/customer.guard';
import { AllowAnonymousSession } from 'src/common/decorators/allow-anonymous-session.decorator';
import { CustomersRepository } from '../repositories/customers.repository';
import { CompanyCustomersRepository } from '../repositories/company-customers.repository';
import { UpdateCustomerProfileDto } from '../dto/update-customer-profile.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller({ path: 'customer', version: '1' })
export class CustomerController {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly companyCustomersRepository: CompanyCustomersRepository,
    private readonly cls: ClsService,
  ) {}

  private getContext(): {
    companyId: string;
    customerId: string;
    tenantSlug?: string;
  } {
    const companyId = this.cls.get<string>('companyId');
    const customerId = this.cls.get<string>('customerId');
    const tenantSlug = this.cls.get<string>('tenantSlug');

    if (!companyId || !customerId) {
      throw new ForbiddenException('Contexto do cliente não encontrado.');
    }

    return { companyId, customerId, tenantSlug };
  }

  @Get('profile/resolve')
  @UseGuards(JwtAuthGuard)
  @AllowAnonymousSession()
  @ApiOperation({
    summary: 'Resolver perfil do cliente para sessão atual',
    description:
      'Retorna o perfil quando a sessão atual é de cliente. Para sessão de funcionário, retorna null.',
  })
  async resolveProfile() {
    const sessionContext = this.cls.get<'EMPLOYEE' | 'CUSTOMER'>(
      'sessionContext',
    );

    if (sessionContext !== 'CUSTOMER') {
      return { profile: null };
    }

    const profile = await this.getProfile();
    return { profile };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOperation({
    summary: 'Obter perfil do cliente',
    description: 'Retorna os dados do cliente autenticado',
  })
  async getProfile() {
    const context = this.getContext();
    const customerData = await this.customersRepository.findById(
      context.customerId,
    );

    if (!customerData) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        context.companyId,
        context.customerId,
      );

    return {
      id: customerData.id,
      email: customerData.email,
      full_name: customerData.full_name,
      phone: customerData.phone,
      birth_date: customerData.birth_date,
      loyalty_level: companyCustomer?.loyalty_level || 'BRONZE',
      accumulated_points: companyCustomer?.accumulated_points || 0,
      company_id: context.companyId,
      tenant_slug: context.tenantSlug,
    };
  }

  @Get('points')
  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOperation({
    summary: 'Obter pontos de fidelidade',
    description: 'Retorna os pontos acumulados do cliente',
  })
  async getPoints() {
    const context = this.getContext();
    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        context.companyId,
        context.customerId,
      );

    return {
      accumulated_points: companyCustomer?.accumulated_points || 0,
      loyalty_level: companyCustomer?.loyalty_level || 'BRONZE',
    };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOperation({
    summary: 'Atualizar perfil do cliente',
    description: 'Permite que o cliente atualize seus próprios dados básicos',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
  })
  async updateProfile(@Body() dto: UpdateCustomerProfileDto) {
    const context = this.getContext();
    const customerData = await this.customersRepository.findById(
      context.customerId,
    );

    if (!customerData) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const updateData: {
      full_name?: string;
      phone?: string;
      birth_date?: Date | null;
    } = {};

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
      context.customerId,
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
