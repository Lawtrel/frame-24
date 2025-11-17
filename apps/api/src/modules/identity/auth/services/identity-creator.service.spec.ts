import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateIdentityData,
  IdentityCreatorService,
} from './identity-creator.service';
import { IdentityRepository } from '../repositories/identity.repository';
import { PersonRepository } from '../repositories/person.repository';
import {
  EmailVerificationService,
  VerificationToken,
} from './email-verification.service';
import { Identity } from '../domain/entities/identity.entity';
import { Person } from '../domain/entities/person.entity';
import { Email } from '../domain/value-objects/email.value-object';
import { Password } from '../domain/value-objects/password.value-object';
import { Mobile } from '../domain/value-objects/mobile.value-object';

jest.mock('../domain/value-objects/email.value-object');
jest.mock('../domain/value-objects/password.value-object');
jest.mock('../domain/value-objects/mobile.value-object');

describe('IdentityCreatorService', () => {
  let service: IdentityCreatorService;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let personRepository: jest.Mocked<PersonRepository>;
  let emailVerificationService: jest.Mocked<EmailVerificationService>;

  const mockPerson: Person = { id: 'person-123' } as Person;
  const mockIdentity: Identity = { id: 'identity-456' } as Identity;
  const mockVerification: VerificationToken = {
    token: 'verification-token-789',
    expiresAt: new Date(),
  };

  const mockCreateData: CreateIdentityData = {
    email: 'novo@example.com',
    password: 'SecurePassword123!',
    fullName: 'João Novo',
    mobile: '11987654321',
  };

  const mockPasswordInstance = {
    hash: 'hashed-password',
    compare: jest.fn(),
  } as unknown as Password;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityCreatorService,
        {
          provide: IdentityRepository,
          useValue: { createWithVerification: jest.fn() },
        },
        {
          provide: PersonRepository,
          useValue: { create: jest.fn() },
        },
        {
          provide: EmailVerificationService,
          useValue: { generateToken: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<IdentityCreatorService>(IdentityCreatorService);
    identityRepository = module.get(IdentityRepository);
    personRepository = module.get(PersonRepository);
    emailVerificationService = module.get(EmailVerificationService);

    (Email.create as jest.Mock).mockReturnValue({ value: 'novo@example.com' });
    (Password.create as jest.Mock).mockResolvedValue(mockPasswordInstance);
    (Mobile.create as jest.Mock).mockReturnValue({ value: '11987654321' });

    // Mocks dos services e repositories
    emailVerificationService.generateToken.mockReturnValue(mockVerification);
    personRepository.create.mockResolvedValue(mockPerson);
    identityRepository.createWithVerification.mockResolvedValue(mockIdentity);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova identidade e pessoa com sucesso', async () => {
      const result = await service.create(mockCreateData);

      expect(result).toEqual({
        identity: mockIdentity,
        person: mockPerson,
        verification: mockVerification,
      });
    });

    it('deve criar os value objects Email, Password e Mobile', async () => {
      await service.create(mockCreateData);

      expect(Email.create).toHaveBeenCalledWith('novo@example.com');
      expect(Password.create).toHaveBeenCalledWith('SecurePassword123!');
      expect(Mobile.create).toHaveBeenCalledWith('11987654321');
    });

    it('não deve criar Mobile se não for fornecido', async () => {
      const dataWithoutMobile = { ...mockCreateData, mobile: undefined };
      await service.create(dataWithoutMobile);

      expect(Mobile.create).not.toHaveBeenCalled();
      expect(personRepository.create).toHaveBeenCalledWith(
        'João Novo',
        'novo@example.com',
        undefined,
      );
    });

    it('deve gerar um token de verificação', async () => {
      await service.create(mockCreateData);

      expect(emailVerificationService.generateToken).toHaveBeenCalled();
    });

    it('deve criar uma pessoa usando PersonRepository', async () => {
      await service.create(mockCreateData);

      expect(personRepository.create).toHaveBeenCalledWith(
        'João Novo',
        'novo@example.com',
        '11987654321',
      );
    });

    it('deve criar uma identidade usando IdentityRepository', async () => {
      await service.create(mockCreateData);

      expect(identityRepository.createWithVerification).toHaveBeenCalledWith({
        personId: 'person-123',
        email: 'novo@example.com',
        passwordHash: 'hashed-password',
        verificationToken: 'verification-token-789',
        verificationExpiresAt: mockVerification.expiresAt,
      });
    });

    it('deve passar personId correto para createWithVerification', async () => {
      const customPerson = { id: 'custom-person-id' } as Person;
      personRepository.create.mockResolvedValue(customPerson);

      await service.create(mockCreateData);

      expect(identityRepository.createWithVerification).toHaveBeenCalledWith(
        expect.objectContaining({
          personId: 'custom-person-id',
        }),
      );
    });

    it('deve passar passwordHash correto para createWithVerification', async () => {
      const customPassword = {
        hash: 'custom-hashed-password',
        compare: jest.fn(),
      } as unknown as Password;

      (Password.create as jest.Mock).mockResolvedValue(customPassword);

      await service.create(mockCreateData);

      expect(identityRepository.createWithVerification).toHaveBeenCalledWith(
        expect.objectContaining({
          passwordHash: 'custom-hashed-password',
        }),
      );
    });

    it('deve retornar a estrutura correta de IdentityWithPerson', async () => {
      const result = await service.create(mockCreateData);

      expect(result).toHaveProperty('identity');
      expect(result).toHaveProperty('person');
      expect(result).toHaveProperty('verification');

      expect(result.identity).toEqual(mockIdentity);
      expect(result.person).toEqual(mockPerson);
      expect(result.verification).toEqual(mockVerification);
    });

    it('deve executar as operações na ordem correta', async () => {
      const callOrder: string[] = [];

      jest.spyOn(Password, 'create').mockImplementation(() => {
        callOrder.push('password');
        return Promise.resolve({
          hash: 'hash',
          compare: jest.fn(),
        } as unknown as Password);
      });

      jest
        .spyOn(emailVerificationService, 'generateToken')
        .mockImplementation(() => {
          callOrder.push('token');
          return mockVerification;
        });

      jest.spyOn(personRepository, 'create').mockImplementation(() => {
        callOrder.push('person');
        return Promise.resolve(mockPerson);
      });

      jest
        .spyOn(identityRepository, 'createWithVerification')
        .mockImplementation(() => {
          callOrder.push('identity');
          return Promise.resolve(mockIdentity);
        });

      await service.create(mockCreateData);

      expect(callOrder).toEqual(['password', 'token', 'person', 'identity']);
    });
  });
});
