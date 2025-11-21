import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Transactional } from '@nestjs-cls/transactional';
import { CustomersRepository } from '../repositories/customers.repository';
import { CompanyCustomersRepository } from '../repositories/company-customers.repository';
import { IdentityRepository } from 'src/modules/identity/auth/repositories/identity.repository';
import { RegisterCustomerDto } from '../dto/register-customer.dto';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { CustomerAuthResponseDto } from '../dto/customer-auth-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class CustomerAuthService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly companyCustomersRepository: CompanyCustomersRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
    private readonly logger: LoggerService,
  ) {}

  @Transactional()
  async register(dto: RegisterCustomerDto): Promise<CustomerAuthResponseDto> {
    // Validar empresa
    const company = await this.prisma.companies.findUnique({
      where: { id: dto.company_id },
    });

    if (!company || !company.active || company.suspended) {
      throw new NotFoundException('Empresa não encontrada ou inativa');
    }

    // Verificar se email já existe
    const existingCustomer = await this.customersRepository.findByEmail(
      dto.email,
    );
    if (existingCustomer) {
      throw new ConflictException('Email já cadastrado');
    }

    // Verificar se CPF já existe
    const existingCpf = await this.customersRepository.findByCpf(dto.cpf);
    if (existingCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Criar identity
    const identityId = this.snowflake.generate();
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const identity = await this.prisma.identities.create({
      data: {
        id: identityId,
        email: dto.email,
        password_hash: hashedPassword,
        identity_type: 'CUSTOMER',
        active: true,
        email_verified: false, // Pode ser verificado depois
      },
    });

    // Criar customer
    const customer = await this.customersRepository.create({
      identity_id: identity.id,
      cpf: dto.cpf,
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone,
      ...(dto.birth_date && {
        birth_date: new Date(dto.birth_date),
      }),
      accepts_marketing: dto.accepts_marketing || false,
      accepts_email: dto.accepts_email !== false,
      accepts_sms: dto.accepts_sms || false,
      terms_accepted: true,
      terms_acceptance_date: new Date(),
      active: true,
      registration_source: 'WEB',
    });

    // Criar vínculo com empresa
    const companyCustomer = await this.companyCustomersRepository.create({
      company_id: dto.company_id,
      customers: { connect: { id: customer.id } },
      is_active_in_loyalty: true,
      loyalty_level: 'BRONZE',
      accumulated_points: 0,
      loyalty_join_date: new Date(),
    });

    // Gerar JWT
    const payload = {
      sub: identity.id,
      identity_id: identity.id,
      company_id: dto.company_id,
      email: dto.email,
      session_context: 'CUSTOMER' as const,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(
      `Customer registered: ${dto.email} for company ${dto.company_id}`,
      CustomerAuthService.name,
    );

    return {
      access_token,
      customer: {
        id: customer.id,
        email: customer.email || dto.email,
        name: customer.full_name,
        company_id: dto.company_id,
        tenant_slug: company.tenant_slug,
        loyalty_level: companyCustomer.loyalty_level || 'BRONZE',
        accumulated_points: companyCustomer.accumulated_points || 0,
      },
    };
  }

  async login(dto: LoginCustomerDto): Promise<CustomerAuthResponseDto> {
    // Validar empresa
    const company = await this.prisma.companies.findUnique({
      where: { id: dto.company_id },
    });

    if (!company || !company.active || company.suspended) {
      throw new NotFoundException('Empresa não encontrada ou inativa');
    }

    // Buscar identity
    const identity = await this.identityRepository.findByEmail(dto.email);

    if (!identity || identity.identityType !== 'CUSTOMER') {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!identity.active) {
      throw new UnauthorizedException('Conta inativa');
    }

    // Validar senha
    if (!identity.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      identity.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Buscar customer
    const customer = await this.customersRepository.findByIdentityId(
      identity.id,
    );

    if (!customer || !customer.active || customer.blocked) {
      throw new UnauthorizedException('Cliente não encontrado ou inativo');
    }

    // Verificar vínculo com empresa
    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        dto.company_id,
        customer.id,
      );

    if (!companyCustomer || !companyCustomer.is_active_in_loyalty) {
      throw new UnauthorizedException('Cliente não vinculado à empresa');
    }

    // Gerar JWT
    const payload = {
      sub: identity.id,
      identity_id: identity.id,
      company_id: dto.company_id,
      email: dto.email,
      session_context: 'CUSTOMER' as const,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(
      `Customer logged in: ${dto.email} for company ${dto.company_id}`,
      CustomerAuthService.name,
    );

    return {
      access_token,
      customer: {
        id: customer.id,
        email: customer.email || dto.email,
        name: customer.full_name,
        company_id: dto.company_id,
        tenant_slug: company.tenant_slug,
        loyalty_level: companyCustomer.loyalty_level || 'BRONZE',
        accumulated_points: companyCustomer.accumulated_points || 0,
      },
    };
  }
}
