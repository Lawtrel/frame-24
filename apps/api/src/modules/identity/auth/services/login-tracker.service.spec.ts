import { Test, TestingModule } from '@nestjs/testing';
import { LoginTrackerService } from './login-tracker.service';
import { IdentityRepository } from '../repositories/identity.repository';
import { CompanyUserRepository } from '../repositories/company-user.repository';
import { Identity } from '../domain/entities/identity.entity';
import { CompanyUser } from '../domain/entities/company-user.entity';

describe('LoginTrackerService', () => {
  let service: LoginTrackerService;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let companyUserRepository: jest.Mocked<CompanyUserRepository>;

  const mockIdentity: Identity = {
    id: 'identity-123',
    loginCount: 5,
  } as Identity;

  const mockCompanyUser: CompanyUser = {
    id: 'company-user-456',
    accessCount: 10,
  } as CompanyUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginTrackerService,
        {
          provide: IdentityRepository,
          useValue: {
            findById: jest.fn(),
            updateLoginTracking: jest.fn(),
          },
        },
        {
          provide: CompanyUserRepository,
          useValue: {
            findById: jest.fn(),
            updateAccessTracking: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoginTrackerService>(LoginTrackerService);
    identityRepository = module.get(IdentityRepository);
    companyUserRepository = module.get(CompanyUserRepository);

    identityRepository.findById.mockResolvedValue(mockIdentity);
    companyUserRepository.findById.mockResolvedValue(mockCompanyUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('track', () => {
    it('deve buscar identity e companyUser por ID', async () => {
      await service.track('identity-123', 'company-user-456');

      expect(identityRepository.findById).toHaveBeenCalledWith('identity-123');
      expect(companyUserRepository.findById).toHaveBeenCalledWith(
        'company-user-456',
      );
    });

    it('deve chamar updateLoginTracking com contagem de login incrementada', async () => {
      await service.track('identity-123', 'company-user-456');

      expect(identityRepository.updateLoginTracking).toHaveBeenCalledWith(
        'identity-123',
        {
          lastLoginDate: expect.any(Date),
          loginCount: 6,
        },
      );
    });

    it('deve chamar updateAccessTracking com contagem de acesso incrementada', async () => {
      await service.track('identity-123', 'company-user-456');

      expect(companyUserRepository.updateAccessTracking).toHaveBeenCalledWith(
        'company-user-456',
        {
          lastAccess: expect.any(Date),
          accessCount: 11,
        },
      );
    });

    it('deve definir loginCount como 1 se for o primeiro login', async () => {
      const firstLoginIdentity = { ...mockIdentity, loginCount: undefined };
      identityRepository.findById.mockResolvedValue(firstLoginIdentity as any);

      await service.track('identity-123', 'company-user-456');

      expect(identityRepository.updateLoginTracking).toHaveBeenCalledWith(
        'identity-123',
        expect.objectContaining({ loginCount: 1 }),
      );
    });

    it('deve definir accessCount como 1 se for o primeiro acesso', async () => {
      const firstAccessUser = { ...mockCompanyUser, accessCount: null };
      companyUserRepository.findById.mockResolvedValue(firstAccessUser as any);

      await service.track('identity-123', 'company-user-456');

      expect(companyUserRepository.updateAccessTracking).toHaveBeenCalledWith(
        'company-user-456',
        expect.objectContaining({ accessCount: 1 }),
      );
    });

    it('deve definir lastLoginDate e lastAccess como data atual', async () => {
      const before = new Date();
      await service.track('identity-123', 'company-user-456');
      const after = new Date();

      const identityCallArgs =
        identityRepository.updateLoginTracking.mock.calls[0][1];
      const companyUserCallArgs =
        companyUserRepository.updateAccessTracking.mock.calls[0][1];

      expect(identityCallArgs.lastLoginDate.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(identityCallArgs.lastLoginDate.getTime()).toBeLessThanOrEqual(
        after.getTime(),
      );
      expect(companyUserCallArgs.lastAccess.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(companyUserCallArgs.lastAccess.getTime()).toBeLessThanOrEqual(
        after.getTime(),
      );
    });

    it('deve funcionar mesmo que identity não seja encontrada', async () => {
      identityRepository.findById.mockResolvedValue(null);

      await service.track('identity-123', 'company-user-456');

      expect(identityRepository.updateLoginTracking).toHaveBeenCalledWith(
        'identity-123',
        expect.objectContaining({ loginCount: 1 }),
      );
    });

    it('deve funcionar mesmo que companyUser não seja encontrado', async () => {
      companyUserRepository.findById.mockResolvedValue(null);

      await service.track('identity-123', 'company-user-456');

      expect(companyUserRepository.updateAccessTracking).toHaveBeenCalledWith(
        'company-user-456',
        expect.objectContaining({ accessCount: 1 }),
      );
    });

    it('deve executar todas as promises em paralelo', async () => {
      await service.track('identity-123', 'company-user-456');

      expect(identityRepository.findById).toHaveBeenCalled();
      expect(companyUserRepository.findById).toHaveBeenCalled();
      expect(identityRepository.updateLoginTracking).toHaveBeenCalled();
      expect(companyUserRepository.updateAccessTracking).toHaveBeenCalled();
    });

    it('deve incrementar corretamente contagens existentes', async () => {
      const customIdentity = { ...mockIdentity, loginCount: 99 };
      const customCompanyUser = { ...mockCompanyUser, accessCount: 49 };
      identityRepository.findById.mockResolvedValue(customIdentity as any);
      companyUserRepository.findById.mockResolvedValue(
        customCompanyUser as any,
      );

      await service.track('identity-123', 'company-user-456');

      expect(identityRepository.updateLoginTracking).toHaveBeenCalledWith(
        'identity-123',
        expect.objectContaining({ loginCount: 100 }),
      );
      expect(companyUserRepository.updateAccessTracking).toHaveBeenCalledWith(
        'company-user-456',
        expect.objectContaining({ accessCount: 50 }),
      );
    });
  });
});
