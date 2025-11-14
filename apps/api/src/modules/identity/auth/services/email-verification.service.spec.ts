jest.mock('@nestjs-cls/transactional', () => ({
  Transactional:
    () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      descriptor,
  TransactionHost: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { IdentityRepository } from '../repositories/identity.repository';
import { PersonRepository } from '../repositories/person.repository';
import { LoggerService } from 'src/common/services/logger.service';
import { Identity } from '../domain/entities/identity.entity';
import { Person } from '../domain/entities/person.entity';

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('verification-token-abc123'),
  }),
}));

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let personRepository: jest.Mocked<PersonRepository>;
  let loggerService: jest.Mocked<LoggerService>;

  const mockIdentity: Identity = {
    id: 'identity-123',
    personId: 'person-123',
    email: 'usuario@example.com',
    emailVerified: false,
    emailVerificationToken: 'valid-token',
    emailVerificationExpiresAt: new Date(Date.now() + 86400000),
  } as Identity;

  const mockPerson: Person = {
    id: 'person-123',
    fullName: 'João Silva',
    email: 'usuario@example.com',
  } as Person;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerificationService,
        {
          provide: IdentityRepository,
          useValue: {
            findByVerificationToken: jest.fn(),
            updateEmailVerification: jest.fn(),
          },
        },
        {
          provide: PersonRepository,
          useValue: {
            findById: jest.fn(),
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

    service = module.get<EmailVerificationService>(EmailVerificationService);
    identityRepository = module.get(IdentityRepository);
    personRepository = module.get(PersonRepository);
    loggerService = module.get(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('deve gerar um token de verificação', () => {
      const result = service.generateToken();

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
      expect(result.token).toBe('verification-token-abc123');
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('deve gerar token com expiração de 24 horas', () => {
      const before = new Date();
      before.setHours(before.getHours() + 24);

      const result = service.generateToken();

      const after = new Date();
      after.setHours(after.getHours() + 24);

      expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime() - 1000,
      );
      expect(result.expiresAt.getTime()).toBeLessThanOrEqual(
        after.getTime() + 1000,
      );
    });
  });

  describe('verifyEmail', () => {
    beforeEach(() => {
      identityRepository.findByVerificationToken.mockResolvedValue(
        mockIdentity,
      );
      personRepository.findById.mockResolvedValue(mockPerson);
    });

    it('deve verificar email com sucesso', async () => {
      const result = await service.verifyEmail('valid-token');

      expect(result).toEqual({
        identity: mockIdentity,
        person: mockPerson,
      });
    });

    it('deve lançar BadRequestException quando token for inválido', async () => {
      identityRepository.findByVerificationToken.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando token estiver expirado', async () => {
      const expiredIdentity = {
        ...mockIdentity,
        emailVerificationExpiresAt: new Date(Date.now() - 3600000),
      } as Identity; // ✅ ADICIONE "as Identity"

      identityRepository.findByVerificationToken.mockResolvedValue(
        expiredIdentity,
      );

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando email já estiver verificado', async () => {
      const verifiedIdentity = {
        ...mockIdentity,
        emailVerified: true,
      } as Identity;

      identityRepository.findByVerificationToken.mockResolvedValue(
        verifiedIdentity,
      );

      await expect(service.verifyEmail('valid-token')).rejects.toThrow(
        'Email já verificado',
      );
    });

    it('deve atualizar email como verificado', async () => {
      await service.verifyEmail('valid-token');

      expect(identityRepository.updateEmailVerification).toHaveBeenCalledWith(
        'identity-123',
        {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiresAt: null,
        },
      );
    });

    it('deve logar sucesso da verificação', async () => {
      await service.verifyEmail('valid-token');

      expect(loggerService.log).toHaveBeenCalledWith(
        'Email verificado: usuario@example.com',
        EmailVerificationService.name,
      );
    });
  });
});
