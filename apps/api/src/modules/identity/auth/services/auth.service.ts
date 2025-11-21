import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { RegisterDto } from '../dto/register.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  CompanySelectionDto,
} from '../dto/auth-response.dto';
import { LoggerService } from 'src/common/services/logger.service';
import { MasterDataSetupService } from 'src/modules/setup/services/master-data-setup.service';
import { TaxSetupService } from 'src/modules/tax/services/tax-setup.service';
import { CompanyService } from '../../companies/services/company.service';

import { IdentityRepository } from '../repositories/identity.repository';
import { CompanyRepository } from '../../companies/repositories/company.repository';
import { CompanyUserRepository } from '../repositories/company-user.repository';

import { CredentialValidatorService } from './credential-validator.service';
import { AccountStatusCheckerService } from './account-status-checker.service';
import { LoginAttemptService } from './login-attempt.service';
import { TokenGeneratorService } from './token-generator.service';
import { LoginTrackerService } from './login-tracker.service';
import { EmailVerificationService } from './email-verification.service';
import { PasswordResetService } from './password-reset.service';
import { IdentityCreatorService } from './identity-creator.service';
import { CompanyUserLinkerService } from './company-user-linker.service';
import { IdentityEventPublisherService } from './identity-event-publisher.service';

import { Cnpj } from '../domain/value-objects/cnpj.value-object';
import { ZipCode } from '../domain/value-objects/zip-code.value-object';
import { Mobile } from '../domain/value-objects/mobile.value-object';
import { SignupDto } from '../dto/signup.dto';
import { CompanyUser } from 'src/modules/identity/auth/domain/entities/company-user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyUserRepository: CompanyUserRepository,
    private readonly companyService: CompanyService,
    private readonly credentialValidator: CredentialValidatorService,
    private readonly accountStatusChecker: AccountStatusCheckerService,
    private readonly loginAttempt: LoginAttemptService,
    private readonly tokenGenerator: TokenGeneratorService,
    private readonly loginTracker: LoginTrackerService,
    private readonly emailVerification: EmailVerificationService,
    private readonly passwordReset: PasswordResetService,
    private readonly identityCreator: IdentityCreatorService,
    private readonly companyUserLinker: CompanyUserLinkerService,
    private readonly eventPublisher: IdentityEventPublisherService,
    private readonly masterDataSetup: MasterDataSetupService,
    private readonly taxSetup: TaxSetupService,
    private readonly logger: LoggerService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    this.logger.log(`Login: ${email}`, AuthService.name);

    try {
      const identity = await this.credentialValidator.validate(email, password);
      this.accountStatusChecker.check(identity);

      const companyUsers: CompanyUser[] =
        await this.companyUserRepository.findAllByIdentity(identity.id);

      if (companyUsers.length === 0) {
        throw new UnauthorizedException(
          'Usuário não vinculado a nenhuma empresa.',
        );
      }

      if (companyUsers.length === 1) {
        const companyUser = companyUsers[0];

        if (!companyUser.active) {
          throw new UnauthorizedException('Acesso negado.');
        }

        await Promise.all([
          this.loginAttempt.resetAttempts(identity.id),
          this.loginTracker.track(identity.id, companyUser.id),
        ]);

        const token = this.tokenGenerator.generate(identity, companyUser);

        this.logger.log(`Login bem-sucedido: ${email}`, AuthService.name);

        return {
          access_token: token.access_token,
          user: token.user,
        };
      }

      const companies = await this.getCompanyList(companyUsers);

      this.logger.log(
        `Login com múltiplas empresas: ${email}`,
        AuthService.name,
      );

      return {
        user: {
          id: identity.id,
          email: identity.email,
          company_id: '',
          role_id: '',
          employee_id: '',
        },
        companies,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        const identity = await this.identityRepository.findByEmail(email);
        if (identity) {
          await this.loginAttempt.recordFailedAttempt(identity.id);
        }
      }
      throw error;
    }
  }

  async selectCompany(
    identityId: string,
    companyId: string,
  ): Promise<LoginResponseDto> {
    this.logger.log(
      `Seleção de empresa: ${identityId} @ ${companyId}`,
      AuthService.name,
    );

    const companyUser =
      await this.companyUserRepository.findByIdentityAndCompany(
        identityId,
        companyId,
      );

    if (!companyUser?.active) {
      throw new UnauthorizedException('Acesso negado nesta empresa.');
    }

    const identity = await this.identityRepository.findById(identityId);

    if (!identity) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    await Promise.all([
      this.loginAttempt.resetAttempts(identityId),
      this.loginTracker.track(identityId, companyUser.id),
    ]);

    this.logger.log(`Empresa selecionada: ${companyId}`, AuthService.name);

    return this.tokenGenerator.generate(identity, companyUser);
  }

  @Transactional()
  async signup(dto: SignupDto): Promise<RegisterResponseDto> {
    this.logger.log(`Signup: ${dto.email}`, AuthService.name);

    await this.validateSignupUniqueness(dto);

    const cnpj = Cnpj.create(dto.cnpj);
    const zipCode = ZipCode.create(dto.company_zip_code);
    const phone = dto.company_phone
      ? Mobile.create(dto.company_phone)
      : undefined;

    const company = await this.companyService.create({
      corporate_name: dto.corporate_name,
      trade_name: dto.trade_name,
      cnpj: cnpj.value,
      zip_code: zipCode.value,
      street_address: dto.company_street_address,
      address_number: dto.company_address_number,
      address_complement: dto.company_address_complement,
      neighborhood: dto.company_neighborhood,
      city: dto.company_city,
      state: dto.company_state,
      country: 'BR',
      phone: phone?.value || '',
      email: dto.company_email,
      plan_type: dto.plan_type || 'BASIC',
    });

    this.logger.log(`Empresa criada: ${company.id}`, AuthService.name);

    const { identity, person, verification } =
      await this.identityCreator.create({
        email: dto.email,
        password: dto.password,
        fullName: dto.full_name,
        mobile: dto.mobile,
      });

    this.logger.log(`Identidade criada: ${identity.id}`, AuthService.name);

    await this.companyUserLinker.createAdminUser(identity.id, company.id);
    await this.masterDataSetup.setupCompanyMasterData(company.id);

    // Configurar impostos baseados no regime tributário e município
    await this.taxSetup.setupCompanyTaxes(
      company.id,
      company.tax_regime,
      dto.company_zip_code,
      dto.company_city,
      dto.company_state,
    );

    await this.eventPublisher.publishCreated({
      identityId: identity.id,
      email: identity.email,
      fullName: person.fullName,
      verificationToken: verification.token,
    });

    this.logger.log(`Signup concluído: ${identity.email}`, AuthService.name);

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
        'EMPLOYEE',
      );

    if (existingIdentity) {
      throw new ConflictException(
        'Já existe um usuário com este email nesta empresa.',
      );
    }

    const { identity, person, verification } =
      await this.identityCreator.create({
        email: dto.email,
        password: dto.password,
        fullName: dto.full_name,
      });

    await this.companyUserLinker.linkToCompany(identity.id, dto.company_id);

    await this.eventPublisher.publishCreated({
      identityId: identity.id,
      email: identity.email,
      fullName: person.fullName,
      verificationToken: verification.token,
    });

    this.logger.log(`Register concluído: ${identity.email}`, AuthService.name);

    return {
      success: true,
      user_id: identity.id,
      email: identity.email,
      message: 'Usuário criado com sucesso. Verifique seu email para ativar.',
    };
  }

  @Transactional()
  async verifyEmail(token: string): Promise<{ message: string }> {
    const { identity, person } =
      await this.emailVerification.verifyEmail(token);

    await this.eventPublisher.publishVerified({
      identityId: identity.id,
      email: identity.email,
      fullName: person.fullName,
    });

    return {
      message: 'Email verificado com sucesso! Você já pode fazer login.',
    };
  }

  @Transactional()
  async requestPasswordReset(email: string): Promise<void> {
    this.logger.log(`Reset de senha solicitado: ${email}`, AuthService.name);

    const result = await this.passwordReset.requestReset(email);

    if (result) {
      await this.eventPublisher.publishPasswordReset({
        identityId: result.identity.id,
        email: result.identity.email,
        fullName: result.person.fullName,
        resetToken: result.token,
      });
    }
  }

  @Transactional()
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    await this.passwordReset.resetPassword(token, newPassword);
    return { message: 'Sua senha foi redefinida com sucesso!' };
  }

  private async getCompanyList(
    companyUsers: CompanyUser[],
  ): Promise<CompanySelectionDto[]> {
    return Promise.all(
      companyUsers
        .filter((cu) => cu.active)
        .map(async (cu) => {
          const company = await this.companyRepository.findById(cu.companyId);

          return {
            company_id: cu.companyId,
            company_name:
              company?.tradeName || company?.corporateName || 'Empresa',
            tenant_slug: company?.tenantSlug || '',
            role_name: '',
          };
        }),
    );
  }

  private async validateSignupUniqueness(dto: SignupDto): Promise<void> {
    const [companyExists, identityExists] = await Promise.all([
      this.companyRepository.findByCnpj(Cnpj.create(dto.cnpj).value),
      this.identityRepository.findByEmail(dto.email),
    ]);

    if (companyExists) {
      throw new ConflictException('CNPJ já cadastrado no sistema.');
    }

    if (identityExists) {
      throw new ConflictException('Email já cadastrado no sistema.');
    }
  }
}
