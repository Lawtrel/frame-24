import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttemptService } from './login-attempt.service';
import { IdentityRepository } from '../repositories/identity.repository';
import { LoggerService } from 'src/common/services/logger.service';
import { Identity } from '../domain/entities/identity.entity';

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let loggerService: jest.Mocked<LoggerService>;

  const mockIdentity: Identity = {
    id: 'identity-123',
    recordFailedAttempt: jest.fn(),
    shouldBlock: jest.fn(),
    block: jest.fn(),
    resetAttempts: jest.fn(),
  } as unknown as Identity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAttemptService,
        {
          provide: IdentityRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
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

    service = module.get<LoginAttemptService>(LoginAttemptService);
    identityRepository = module.get(IdentityRepository);
    loggerService = module.get(LoggerService);

    identityRepository.findById.mockResolvedValue(mockIdentity);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('recordFailedAttempt', () => {
    it('deve registrar tentativa de login falhada', async () => {
      await service.recordFailedAttempt('identity-123');

      expect(identityRepository.findById).toHaveBeenCalledWith('identity-123');
      expect(mockIdentity.recordFailedAttempt).toHaveBeenCalled();
      expect(identityRepository.save).toHaveBeenCalledWith(mockIdentity);
    });

    it('não deve fazer nada se a identidade não for encontrada', async () => {
      identityRepository.findById.mockResolvedValue(null);

      await service.recordFailedAttempt('id-inexistente');

      expect(identityRepository.findById).toHaveBeenCalledWith(
        'id-inexistente',
      );
      expect(mockIdentity.recordFailedAttempt).not.toHaveBeenCalled();
      expect(identityRepository.save).not.toHaveBeenCalled();
    });

    it('deve bloquear a conta após 5 tentativas falhadas', async () => {
      (mockIdentity.shouldBlock as jest.Mock).mockReturnValue(true);

      await service.recordFailedAttempt('identity-123');

      expect(mockIdentity.shouldBlock).toHaveBeenCalledWith(5);
      expect(mockIdentity.block).toHaveBeenCalledWith(30);
      expect(identityRepository.save).toHaveBeenCalledWith(mockIdentity);
      expect(loggerService.warn).toHaveBeenCalledWith(
        'Conta bloqueada: identity-123',
        LoginAttemptService.name,
      );
    });

    it('não deve bloquear a conta antes do limite de tentativas', async () => {
      (mockIdentity.shouldBlock as jest.Mock).mockReturnValue(false);

      await service.recordFailedAttempt('identity-123');

      expect(mockIdentity.shouldBlock).toHaveBeenCalledWith(5);
      expect(mockIdentity.block).not.toHaveBeenCalled();
      expect(identityRepository.save).toHaveBeenCalledWith(mockIdentity);
      expect(loggerService.warn).not.toHaveBeenCalled();
    });

    it('deve usar MAX_FAILED_ATTEMPTS e BLOCK_DURATION_MINUTES', async () => {
      (mockIdentity.shouldBlock as jest.Mock).mockReturnValue(true);

      await service.recordFailedAttempt('identity-123');

      expect(mockIdentity.shouldBlock).toHaveBeenCalledWith(5);
      expect(mockIdentity.block).toHaveBeenCalledWith(30);
    });

    it('deve salvar a identidade após cada tentativa falhada', async () => {
      await service.recordFailedAttempt('identity-123');
      expect(identityRepository.save).toHaveBeenCalledTimes(1);

      (mockIdentity.shouldBlock as jest.Mock).mockReturnValue(true);
      await service.recordFailedAttempt('identity-123');
      expect(identityRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('resetAttempts', () => {
    it('deve resetar as tentativas de login', async () => {
      await service.resetAttempts('identity-123');

      expect(identityRepository.findById).toHaveBeenCalledWith('identity-123');
      expect(mockIdentity.resetAttempts).toHaveBeenCalled();
      expect(identityRepository.save).toHaveBeenCalledWith(mockIdentity);
    });

    it('não deve fazer nada se a identidade não for encontrada', async () => {
      identityRepository.findById.mockResolvedValue(null);

      await service.resetAttempts('id-inexistente');

      expect(identityRepository.findById).toHaveBeenCalledWith(
        'id-inexistente',
      );
      expect(mockIdentity.resetAttempts).not.toHaveBeenCalled();
      expect(identityRepository.save).not.toHaveBeenCalled();
    });

    it('deve chamar o método resetAttempts da entidade', async () => {
      await service.resetAttempts('identity-123');

      expect(mockIdentity.resetAttempts).toHaveBeenCalledTimes(1);
    });

    it('deve salvar a entidade após resetar as tentativas', async () => {
      await service.resetAttempts('identity-123');

      expect(identityRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
