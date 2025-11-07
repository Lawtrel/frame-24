import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Transactional } from '@nestjs-cls/transactional';
import { identities, identity_type, Prisma } from '@repo/db';

import { IdentityRepository } from '../repositories/identity.repository';
import { PersonRepository } from '../repositories/person.repository';
import { CompanyUserRepository } from '../repositories/company-user.repository';
import { CompanyRepository } from '../../companies/repositories/company.repository';
import { CustomRoleRepository } from '../repositories/custom-role.repository';

import { SignupDtoSwagger } from '../dto/signup.dto';
import { RegisterDto } from '../dto/register.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
} from '../dto/auth-response.dto';

import { LoggerService } from 'src/common/services/logger.service';
import { MasterDataSetupService } from 'src/modules/setup/services/master-data-setup.service';
import { EmployeeIdGeneratorService } from 'src/modules/identity/auth/services/employee-id-generator';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import {
  IdentityCreatedEventData,
  IdentityEventPattern,
  IdentityVerifiedEventData,
} from 'src/modules/identity/events/identity.events';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MINUTES = 30;

  constructor(
    private rabbitmq: RabbitMQPublisherService,
    private readonly identityRepository: IdentityRepository,
    private readonly personRepository: PersonRepository,
    private readonly companyUserRepository: CompanyUserRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly customRoleRepository: CustomRoleRepository,
    private readonly employeeIdGenerator: EmployeeIdGeneratorService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
    private readonly masterDataSetup: MasterDataSetupService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    company_id?: string,
  ): Promise<identities> {
    this.logger.log(
      `Login attempt: ${email} @ ${company_id || 'any'}`,
      AuthService.name,
    );

    const identity = await this.identityRepository.findByEmailAndCompany(
      email,
      company_id,
      'EMPLOYEE' as identity_type,
    );

    if (!identity) {
      this.logger.warn(
        `Login failed: user not found - ${email}`,
        AuthService.name,
      );
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (identity.blocked_until && identity.blocked_until > new Date()) {
      throw new UnauthorizedException(
        `Conta bloqueada até ${identity.blocked_until.toISOString()}.`,
      );
    }

    if (!identity.active) {
      throw new UnauthorizedException('Conta desativada.');
    }

    if (!identity.email_verified) {
      throw new UnauthorizedException(
        'Email não verificado. Por favor, verifique seu email antes de fazer login.',
      );
    }

    if (!identity.password_hash) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      identity.password_hash,
    );

    if (!isPasswordValid) {
      await this.handleFailedLogin(identity.id);
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    await this.resetFailedAttempts(identity.id);

    this.logger.log(`Login OK: ${email}`, AuthService.name);

    return identity;
  }

  async login(
    identity_id: string,
    company_id?: string,
  ): Promise<LoginResponseDto> {
    const companyUser =
      await this.companyUserRepository.findByIdentityAndCompany(
        identity_id,
        company_id,
      );

    if (!companyUser?.active) {
      throw new UnauthorizedException('Acesso negado nesta empresa.');
    }

    const identity = await this.identityRepository.findById(identity_id);

    if (!identity) {
      throw new NotFoundException('Identity não encontrada.');
    }

    await this.identityRepository.update(identity_id, {
      last_login_date: new Date(),
      login_count: (identity.login_count ?? 0) + 1,
    });

    await this.companyUserRepository.update(companyUser.id, {
      last_access: new Date(),
      access_count: (companyUser.access_count ?? 0) + 1,
    });

    const payload = {
      sub: identity_id,
      identity_id,
      company_id: companyUser.company_id,
      email: identity.email,
      company_user_id: companyUser.id,
      role_id: companyUser.role_id,
      session_context: 'EMPLOYEE' as const,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(`Token gerado: ${identity_id}`, AuthService.name);

    return {
      access_token,
      user: {
        id: identity.id,
        email: identity.email,
        company_id: companyUser.company_id,
        role_id: companyUser.role_id,
        employee_id: companyUser.employee_id,
      },
    };
  }

  @Transactional()
  async signup(dto: SignupDtoSwagger): Promise<RegisterResponseDto> {
    this.logger.log(`Signup: ${dto.email}`, AuthService.name);

    const existingCompany = await this.companyRepository.findByCnpj(dto.cnpj);
    if (existingCompany) {
      throw new ConflictException('CNPJ já cadastrado no sistema.');
    }

    const existingIdentity = await this.identityRepository.findByEmail(
      dto.email,
    );
    if (existingIdentity) {
      throw new ConflictException('Email já cadastrado no sistema.');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const company = await this.companyRepository.create({
      corporate_name: dto.corporate_name,
      trade_name: dto.trade_name,
      cnpj: this.normalizeCnpj(dto.cnpj),
      tenant_slug: this.generateTenantSlug(dto.corporate_name, dto.cnpj),
      zip_code: this.normalizeZipCode(dto.company_zip_code),
      street_address: dto.company_street_address,
      address_number: dto.company_address_number,
      address_complement: dto.company_address_complement,
      neighborhood: dto.company_neighborhood,
      city: dto.company_city,
      state: dto.company_state,
      country: 'BR',
      phone: this.normalizeMobile(dto.company_phone || ''),
      email: dto.company_email,
      plan_type: dto.plan_type || 'BASIC',
      active: true,
    } as Prisma.companiesCreateInput);

    this.logger.log(`Company created: ${company.id}`, AuthService.name);

    const person = await this.personRepository.create({
      full_name: dto.full_name,
      mobile: this.normalizeMobile(dto.mobile),
      email: dto.email,
    } as Prisma.personsCreateInput);

    this.logger.log(`Person created: ${person.id}`, AuthService.name);

    const identity = await this.identityRepository.create({
      persons: { connect: { id: person.id } },
      email: dto.email,
      identity_type: 'EMPLOYEE' as identity_type,
      password_hash,
      active: true,
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires_at: expiresAt,
    } as Prisma.identitiesCreateInput);

    this.logger.log(`Identity created: ${identity.id}`, AuthService.name);

    const adminRole = await this.customRoleRepository.create({
      companies: { connect: { id: company.id } },
      name: 'Administrador',
      description: 'Administrador com acesso total',
      is_system_role: true,
      hierarchy_level: 1,
    } as Prisma.custom_rolesCreateInput);

    this.logger.log(`Admin role created: ${adminRole.id}`, AuthService.name);

    const employee_id = await this.employeeIdGenerator.generate(company.id);

    await this.companyUserRepository.create({
      identities: { connect: { id: identity.id } },
      companies: { connect: { id: company.id } },
      custom_roles: { connect: { id: adminRole.id } },
      employee_id,
      active: true,
      start_date: new Date(),
    } as Prisma.company_usersCreateInput);

    this.logger.log(`CompanyUser created: ${identity.id}`, AuthService.name);

    await this.masterDataSetup.setupCompanyMasterData(company.id);

    this.rabbitmq.publish<IdentityCreatedEventData>({
      pattern: IdentityEventPattern.CREATED,
      data: {
        identity_id: identity.id,
        email: identity.email,
        full_name: dto.full_name,
        verification_token: verificationToken,
      },
      metadata: {
        correlationId: this.generateCorrelationId(),
      },
    });

    this.logger.log(`Signup completed: ${identity.email}`, AuthService.name);

    return {
      success: true,
      user_id: identity.id,
      email: identity.email,
      message: 'Conta criada com sucesso! Verifique seu email para ativar.',
    };
  }

  @Transactional()
  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    this.logger.log(
      `Register: ${dto.email} @ ${dto.company_id}`,
      AuthService.name,
    );

    const company = await this.companyRepository.findById(dto.company_id);
    if (!company?.active) {
      throw new NotFoundException('Empresa inválida ou inativa.');
    }

    const existingIdentity =
      await this.identityRepository.findByEmailAndCompany(
        dto.email,
        dto.company_id,
        'EMPLOYEE' as identity_type,
      );

    if (existingIdentity) {
      throw new ConflictException(
        'Já existe um usuário com este email nesta empresa.',
      );
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const person = await this.personRepository.create({
      full_name: dto.full_name,
    } as Prisma.personsCreateInput);

    this.logger.log(`Person created: ${person.id}`, AuthService.name);

    const identity = await this.identityRepository.create({
      persons: { connect: { id: person.id } },
      email: dto.email,
      identity_type: 'EMPLOYEE' as identity_type,
      password_hash,
      active: true,
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires_at: expiresAt,
    } as Prisma.identitiesCreateInput);

    this.logger.log(`Identity created: ${identity.id}`, AuthService.name);

    const defaultRole = await this.customRoleRepository.findDefaultRole(
      dto.company_id,
    );

    if (!defaultRole) {
      throw new NotFoundException(
        'Role padrão não encontrada. Contate o administrador.',
      );
    }

    const employee_id = await this.employeeIdGenerator.generate(dto.company_id);

    await this.companyUserRepository.create({
      identities: { connect: { id: identity.id } },
      companies: { connect: { id: dto.company_id } },
      custom_roles: { connect: { id: defaultRole.id } },
      employee_id,
      active: true,
      start_date: new Date(),
    } as Prisma.company_usersCreateInput);

    this.rabbitmq.publish<IdentityCreatedEventData>({
      pattern: IdentityEventPattern.CREATED,
      data: {
        identity_id: identity.id,
        email: identity.email,
        full_name: dto.full_name,
        verification_token: verificationToken,
      },
      metadata: {
        correlationId: this.generateCorrelationId(),
      },
    });

    this.logger.log(`Register completed: ${identity.email}`, AuthService.name);

    return {
      success: true,
      user_id: identity.id,
      email: identity.email,
      message: 'Usuário criado com sucesso. Verifique seu email para ativar.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const identity =
      await this.identityRepository.findByVerificationToken(token);

    if (
      !identity ||
      !identity.email_verification_expires_at ||
      identity.email_verification_expires_at < new Date()
    ) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    if (identity.email_verified) {
      throw new BadRequestException('Email já verificado');
    }

    if (!identity.person_id) {
      this.logger.error(
        `Identity ${identity.id} não possui person_id associado.`,
        'AuthService',
      );
      throw new NotFoundException(
        'Dados de usuário inconsistentes. Contate o suporte.',
      );
    }

    const person = await this.personRepository.findById(identity.person_id);
    if (!person) {
      throw new NotFoundException(
        'Dados de usuário associados não encontrados.',
      );
    }
    await this.identityRepository.update(identity.id, {
      email_verified: true,
      email_verification_token: null,
      email_verification_expires_at: null,
    });

    this.rabbitmq.publish<IdentityVerifiedEventData>({
      pattern: IdentityEventPattern.VERIFIED,
      data: {
        identity_id: identity.id,
        email: identity.email,
        full_name: person.full_name,
      },
      metadata: {
        correlationId: this.generateCorrelationId(),
      },
    });

    this.logger.log(`Email verified: ${identity.email}`, AuthService.name);

    return {
      message: 'Email verificado com sucesso! Você já pode fazer login.',
    };
  }

  private async handleFailedLogin(identity_id: string): Promise<void> {
    const identity = await this.identityRepository.findById(identity_id);
    if (!identity) return;

    const attempts = (identity.failed_login_attempts ?? 0) + 1;

    if (attempts >= this.MAX_FAILED_ATTEMPTS) {
      const blockedUntil = new Date();
      blockedUntil.setMinutes(
        blockedUntil.getMinutes() + this.BLOCK_DURATION_MINUTES,
      );

      await this.identityRepository.update(identity_id, {
        failed_login_attempts: attempts,
        last_failed_login: new Date(),
        blocked_until: blockedUntil,
        block_reason: `Bloqueado por ${this.MAX_FAILED_ATTEMPTS} tentativas falhadas.`,
      });

      this.logger.warn(
        `Account locked: ${identity_id} until ${blockedUntil.toISOString()}`,
        AuthService.name,
      );
    } else {
      await this.identityRepository.update(identity_id, {
        failed_login_attempts: attempts,
        last_failed_login: new Date(),
      });

      this.logger.warn(
        `Failed login attempt ${attempts}/${this.MAX_FAILED_ATTEMPTS}: ${identity_id}`,
        AuthService.name,
      );
    }
  }

  private async resetFailedAttempts(identity_id: string): Promise<void> {
    await this.identityRepository.update(identity_id, {
      failed_login_attempts: 0,
      last_failed_login: null,
      blocked_until: null,
      block_reason: null,
    });
  }

  private generateTenantSlug(name: string, cnpj: string): string {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const suffix = cnpj.replace(/\D/g, '').slice(-4);
    return `${slug}-${suffix}`;
  }

  private normalizeCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  private normalizeZipCode(zip: string): string {
    return zip.replace(/\D/g, '');
  }

  private normalizeMobile(mobile: string): string {
    return mobile.replace(/\D/g, '');
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
