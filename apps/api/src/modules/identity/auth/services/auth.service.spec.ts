jest.mock('@nestjs-cls/transactional', () => ({
  Transactional:
    () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      descriptor,
  TransactionHost: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IdentityRepository } from '../repositories/identity.repository';
import { CompanyRepository } from '../../companies/repositories/company.repository';
import { CompanyUserRepository } from '../repositories/company-user.repository';
import { CompanyService } from '../../companies/services/company.service';
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
import { MasterDataSetupService } from 'src/modules/setup/services/master-data-setup.service';
import { LoggerService } from 'src/common/services/logger.service';
import { Identity } from '../domain/entities/identity.entity';
import { CompanyUser } from '../domain/entities/company-user.entity';
import { Cnpj } from '../domain/value-objects/cnpj.value-object';
import { ZipCode } from '../domain/value-objects/zip-code.value-object';
import { Mobile } from '../domain/value-objects/mobile.value-object';

jest.mock('../domain/value-objects/cnpj.value-object');
jest.mock('../domain/value-objects/zip-code.value-object');
jest.mock('../domain/value-objects/mobile.value-object');

describe('AuthService', () => {
  let service: AuthService;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let companyUserRepository: jest.Mocked<CompanyUserRepository>;
  let companyService: jest.Mocked<CompanyService>;
  let credentialValidator: jest.Mocked<CredentialValidatorService>;
  let accountStatusChecker: jest.Mocked<AccountStatusCheckerService>;
  let loginAttempt: jest.Mocked<LoginAttemptService>;
  let tokenGenerator: jest.Mocked<TokenGeneratorService>;
  let loginTracker: jest.Mocked<LoginTrackerService>;
  let emailVerification: jest.Mocked<EmailVerificationService>;
  let passwordReset: jest.Mocked<PasswordResetService>;
  let identityCreator: jest.Mocked<IdentityCreatorService>;
  let companyUserLinker: jest.Mocked<CompanyUserLinkerService>;
  let eventPublisher: jest.Mocked<IdentityEventPublisherService>;
  let masterDataSetup: jest.Mocked<MasterDataSetupService>;

  const mockIdentity: Identity = {
    id: 'identity-123',
    email: 'usuario@example.com',
    active: true,
    emailVerified: true,
  } as Identity;

  const mockCompanyUser: CompanyUser = {
    id: 'company-user-456',
    identityId: 'identity-123',
    companyId: 'company-789',
    roleId: 'role-111',
    active: true,
  } as CompanyUser;

  const mockCompany = {
    id: 'company-789',
    corporateName: 'Empresa Teste LTDA',
    tradeName: 'Empresa Teste',
    tenantSlug: 'empresa-teste',
    active: true,
  };

  const mockToken = {
    access_token: 'jwt-token-abc',
    user: {
      id: 'identity-123',
      email: 'usuario@example.com',
      company_id: 'company-789',
      role_id: 'role-111',
      employee_id: 'EMP-001',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: IdentityRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findByEmailAndCompany: jest.fn(),
          },
        },
        {
          provide: CompanyRepository,
          useValue: {
            findById: jest.fn(),
            findByCnpj: jest.fn(),
          },
        },
        {
          provide: CompanyUserRepository,
          useValue: {
            findAllByIdentity: jest.fn(),
            findByIdentityAndCompany: jest.fn(),
          },
        },
        {
          provide: CompanyService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CredentialValidatorService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: AccountStatusCheckerService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: LoginAttemptService,
          useValue: {
            recordFailedAttempt: jest.fn(),
            resetAttempts: jest.fn(),
          },
        },
        {
          provide: TokenGeneratorService,
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: LoginTrackerService,
          useValue: {
            track: jest.fn(),
          },
        },
        {
          provide: EmailVerificationService,
          useValue: {
            verifyEmail: jest.fn(),
          },
        },
        {
          provide: PasswordResetService,
          useValue: {
            requestReset: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
        {
          provide: IdentityCreatorService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CompanyUserLinkerService,
          useValue: {
            linkToCompany: jest.fn(),
            createAdminUser: jest.fn(),
          },
        },
        {
          provide: IdentityEventPublisherService,
          useValue: {
            publishCreated: jest.fn(),
            publishVerified: jest.fn(),
            publishPasswordReset: jest.fn(),
          },
        },
        {
          provide: MasterDataSetupService,
          useValue: {
            setupCompanyMasterData: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    identityRepository = module.get(IdentityRepository);
    companyRepository = module.get(CompanyRepository);
    companyUserRepository = module.get(CompanyUserRepository);
    companyService = module.get(CompanyService);
    credentialValidator = module.get(CredentialValidatorService);
    accountStatusChecker = module.get(AccountStatusCheckerService);
    loginAttempt = module.get(LoginAttemptService);
    tokenGenerator = module.get(TokenGeneratorService);
    loginTracker = module.get(LoginTrackerService);
    emailVerification = module.get(EmailVerificationService);
    passwordReset = module.get(PasswordResetService);
    identityCreator = module.get(IdentityCreatorService);
    companyUserLinker = module.get(CompanyUserLinkerService);
    eventPublisher = module.get(IdentityEventPublisherService);
    masterDataSetup = module.get(MasterDataSetupService);

    // Mock dos value objects
    (Cnpj.create as jest.Mock).mockReturnValue({ value: '12345678000199' });
    (ZipCode.create as jest.Mock).mockReturnValue({ value: '01310100' });
    (Mobile.create as jest.Mock).mockReturnValue({ value: '11999999999' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const email = 'usuario@example.com';
    const password = 'mockedPassword123';

    beforeEach(() => {
      credentialValidator.validate.mockResolvedValue(mockIdentity);
      companyUserRepository.findAllByIdentity.mockResolvedValue([
        mockCompanyUser,
      ]);
      tokenGenerator.generate.mockReturnValue(mockToken);
    });

    it('deve fazer login com sucesso para usuário com uma empresa', async () => {
      const result = await service.login(email, password);

      expect(result).toEqual({
        access_token: 'jwt-token-abc',
        user: mockToken.user,
      });
    });

    it('deve validar credenciais', async () => {
      await service.login(email, password);

      expect(credentialValidator.validate).toHaveBeenCalledWith(
        email,
        password,
      );
    });

    it('deve verificar status da conta', async () => {
      await service.login(email, password);

      expect(accountStatusChecker.check).toHaveBeenCalledWith(mockIdentity);
    });

    it('deve buscar empresas do usuário', async () => {
      await service.login(email, password);

      expect(companyUserRepository.findAllByIdentity).toHaveBeenCalledWith(
        'identity-123',
      );
    });

    it('deve lançar UnauthorizedException quando usuário não tiver empresas', async () => {
      companyUserRepository.findAllByIdentity.mockResolvedValue([]);

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(email, password)).rejects.toThrow(
        'Usuário não vinculado a nenhuma empresa',
      );
    });

    it('deve lançar UnauthorizedException quando company_user estiver inativo', async () => {
      const inactiveCompanyUser = {
        ...mockCompanyUser,
        active: false,
      } as CompanyUser;
      companyUserRepository.findAllByIdentity.mockResolvedValue([
        inactiveCompanyUser,
      ]);

      await expect(service.login(email, password)).rejects.toThrow(
        'Acesso negado',
      );
    });

    it('deve resetar tentativas de login após sucesso', async () => {
      await service.login(email, password);

      expect(loginAttempt.resetAttempts).toHaveBeenCalledWith('identity-123');
    });

    it('deve rastrear o login', async () => {
      await service.login(email, password);

      expect(loginTracker.track).toHaveBeenCalledWith(
        'identity-123',
        'company-user-456',
      );
    });

    it('deve gerar token JWT', async () => {
      await service.login(email, password);

      expect(tokenGenerator.generate).toHaveBeenCalledWith(
        mockIdentity,
        mockCompanyUser,
      );
    });

    it('deve retornar lista de empresas quando usuário tiver múltiplas', async () => {
      const multipleCompanyUsers = [
        mockCompanyUser,
        {
          ...mockCompanyUser,
          id: 'cu-2',
          companyId: 'company-999',
        } as CompanyUser,
      ];
      companyUserRepository.findAllByIdentity.mockResolvedValue(
        multipleCompanyUsers,
      );
      companyRepository.findById.mockResolvedValue(mockCompany as any);

      const result = await service.login(email, password);

      expect(result.companies).toBeDefined();
      expect(result.companies).toHaveLength(2);
      expect(tokenGenerator.generate).not.toHaveBeenCalled();
    });

    it('deve registrar tentativa falhada quando credenciais inválidas', async () => {
      credentialValidator.validate.mockRejectedValue(
        new UnauthorizedException('Credenciais inválidas'),
      );
      identityRepository.findByEmail.mockResolvedValue(mockIdentity);

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(loginAttempt.recordFailedAttempt).toHaveBeenCalledWith(
        'identity-123',
      );
    });
  });

  describe('selectCompany', () => {
    beforeEach(() => {
      companyUserRepository.findByIdentityAndCompany.mockResolvedValue(
        mockCompanyUser,
      );
      identityRepository.findById.mockResolvedValue(mockIdentity);
      tokenGenerator.generate.mockReturnValue(mockToken);
    });

    it('deve selecionar empresa com sucesso', async () => {
      const result = await service.selectCompany('identity-123', 'company-789');

      expect(result).toEqual(mockToken);
    });

    it('deve lançar UnauthorizedException quando company_user não existir', async () => {
      companyUserRepository.findByIdentityAndCompany.mockResolvedValue(null);

      await expect(
        service.selectCompany('identity-123', 'company-789'),
      ).rejects.toThrow('Acesso negado nesta empresa');
    });

    it('deve resetar tentativas após seleção', async () => {
      await service.selectCompany('identity-123', 'company-789');

      expect(loginAttempt.resetAttempts).toHaveBeenCalledWith('identity-123');
    });
  });

  describe('signup', () => {
    const signupDto = {
      email: 'novo@example.com',
      password: 'mockedPassword123',
      full_name: 'João Novo',
      cnpj: '12.345.678/0001-99',
      corporate_name: 'Empresa Nova LTDA',
      company_zip_code: '01310-100',
    } as any;

    beforeEach(() => {
      companyRepository.findByCnpj.mockResolvedValue(null);
      identityRepository.findByEmail.mockResolvedValue(null);
      companyService.create.mockResolvedValue(mockCompany as any);
      identityCreator.create.mockResolvedValue({
        identity: mockIdentity,
        person: { id: 'person-1', fullName: 'João Novo' } as any,
        verification: { token: 'token-abc', expiresAt: new Date() },
      });
    });

    it('deve criar conta com sucesso', async () => {
      const result = await service.signup(signupDto);

      expect(result.success).toBe(true);
      expect(result.user_id).toBe('identity-123');
      expect(result.email).toBe('usuario@example.com');
      expect(result.message).toContain('Conta criada com sucesso');
    });

    it('deve lançar ConflictException quando CNPJ já existe', async () => {
      companyRepository.findByCnpj.mockResolvedValue(mockCompany as any);

      await expect(service.signup(signupDto)).rejects.toThrow(
        'CNPJ já cadastrado no sistema',
      );
    });

    it('deve criar empresa e identidade', async () => {
      await service.signup(signupDto);

      expect(companyService.create).toHaveBeenCalled();
      expect(identityCreator.create).toHaveBeenCalled();
    });

    it('deve criar usuário admin', async () => {
      await service.signup(signupDto);

      expect(companyUserLinker.createAdminUser).toHaveBeenCalledWith(
        'identity-123',
        'company-789',
      );
    });

    it('deve configurar master data', async () => {
      await service.signup(signupDto);

      expect(masterDataSetup.setupCompanyMasterData).toHaveBeenCalledWith(
        'company-789',
      );
    });

    it('deve publicar evento de criação', async () => {
      await service.signup(signupDto);

      expect(eventPublisher.publishCreated).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    beforeEach(() => {
      emailVerification.verifyEmail.mockResolvedValue({
        identity: mockIdentity,
        person: { id: 'person-1', fullName: 'João' } as any,
      });
    });

    it('deve verificar email com sucesso', async () => {
      const result = await service.verifyEmail('token-abc');

      expect(result.message).toContain('Email verificado com sucesso');
    });

    it('deve publicar evento de verificação', async () => {
      await service.verifyEmail('token-abc');

      expect(eventPublisher.publishVerified).toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    beforeEach(() => {
      passwordReset.requestReset.mockResolvedValue({
        identity: mockIdentity,
        person: { id: 'person-1', fullName: 'João' } as any,
        token: 'reset-token-abc',
      });
    });

    it('deve solicitar reset de senha', async () => {
      await service.requestPasswordReset('usuario@example.com');

      expect(passwordReset.requestReset).toHaveBeenCalledWith(
        'usuario@example.com',
      );
    });

    it('deve publicar evento de reset', async () => {
      await service.requestPasswordReset('usuario@example.com');

      expect(eventPublisher.publishPasswordReset).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha com sucesso', async () => {
      const result = await service.resetPassword('token-abc', 'NovaSenha123!');

      expect(result.message).toContain('senha foi redefinida com sucesso');
      expect(passwordReset.resetPassword).toHaveBeenCalledWith(
        'token-abc',
        'NovaSenha123!',
      );
    });
  });
});
