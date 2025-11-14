import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { CredentialValidatorService } from './credential-validator.service';
import { IdentityRepository } from '../repositories/identity.repository';
import { LoggerService } from 'src/common/services/logger.service';
import { Identity } from '../domain/entities/identity.entity';
import { Password } from '../domain/value-objects/password.value-object';

jest.mock('../domain/value-objects/password.value-object');

describe('CredentialValidatorService', () => {
  let service: CredentialValidatorService;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let loggerService: jest.Mocked<LoggerService>;

  const mockIdentity: Identity = {
    id: 'identity-123',
    email: 'usuario@example.com',
    passwordHash: 'hashed-password',
    active: true,
  } as Identity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialValidatorService,
        {
          provide: IdentityRepository,
          useValue: {
            findByEmailAndCompany: jest.fn(),
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

    service = module.get<CredentialValidatorService>(
      CredentialValidatorService,
    );
    identityRepository = module.get(IdentityRepository);
    loggerService = module.get(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    const email = 'usuario@example.com';
    const plainPassword = 'SenhaCorreta123!';
    const companyId = 'company-456';

    beforeEach(() => {
      identityRepository.findByEmailAndCompany.mockResolvedValue(mockIdentity);

      const mockPasswordInstance = {
        compare: jest.fn().mockResolvedValue(true),
      };
      (Password.fromHash as jest.Mock).mockReturnValue(mockPasswordInstance);
    });

    it('deve validar credenciais com sucesso', async () => {
      const result = await service.validate(email, plainPassword, companyId);

      expect(result).toEqual(mockIdentity);
    });

    it('deve buscar identidade com email, companyId e tipo EMPLOYEE', async () => {
      await service.validate(email, plainPassword, companyId);

      expect(identityRepository.findByEmailAndCompany).toHaveBeenCalledWith(
        email,
        companyId,
        'EMPLOYEE',
      );
    });

    it('deve lançar UnauthorizedException quando identidade não for encontrada', async () => {
      identityRepository.findByEmailAndCompany.mockResolvedValue(null);

      await expect(
        service.validate(email, plainPassword, companyId),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.validate(email, plainPassword, companyId),
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve logar aviso quando credenciais forem inválidas', async () => {
      identityRepository.findByEmailAndCompany.mockResolvedValue(null);

      await expect(
        service.validate(email, plainPassword, companyId),
      ).rejects.toThrow(UnauthorizedException);

      expect(loggerService.warn).toHaveBeenCalledWith(
        `Credenciais inválidas para: ${email}`,
        CredentialValidatorService.name,
      );
    });

    it('deve lançar UnauthorizedException quando passwordHash for null', async () => {
      const identityWithoutPassword = {
        ...mockIdentity,
        passwordHash: null,
      } as Identity;
      identityRepository.findByEmailAndCompany.mockResolvedValue(
        identityWithoutPassword,
      );

      await expect(
        service.validate(email, plainPassword, companyId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve criar instância de Password usando fromHash', async () => {
      await service.validate(email, plainPassword, companyId);

      expect(Password.fromHash).toHaveBeenCalledWith('hashed-password');
    });

    it('deve comparar senha usando o método compare do Password', async () => {
      const mockPasswordInstance = {
        compare: jest.fn().mockResolvedValue(true),
      };
      (Password.fromHash as jest.Mock).mockReturnValue(mockPasswordInstance);

      await service.validate(email, plainPassword, companyId);

      expect(mockPasswordInstance.compare).toHaveBeenCalledWith(plainPassword);
    });

    it('deve lançar UnauthorizedException quando senha for inválida', async () => {
      const mockPasswordInstance = {
        compare: jest.fn().mockResolvedValue(false),
      };
      (Password.fromHash as jest.Mock).mockReturnValue(mockPasswordInstance);

      await expect(
        service.validate(email, plainPassword, companyId),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.validate(email, plainPassword, companyId),
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve funcionar sem companyId (opcional)', async () => {
      const result = await service.validate(email, plainPassword);

      expect(result).toEqual(mockIdentity);
      expect(identityRepository.findByEmailAndCompany).toHaveBeenCalledWith(
        email,
        undefined,
        'EMPLOYEE',
      );
    });

    it('deve retornar a identidade quando validação for bem-sucedida', async () => {
      const result = await service.validate(email, plainPassword, companyId);

      expect(result).toBe(mockIdentity);
      expect(result.id).toBe('identity-123');
      expect(result.email).toBe('usuario@example.com');
    });

    it('não deve logar warning quando credenciais forem válidas', async () => {
      await service.validate(email, plainPassword, companyId);

      expect(loggerService.warn).not.toHaveBeenCalled();
    });
  });
});
