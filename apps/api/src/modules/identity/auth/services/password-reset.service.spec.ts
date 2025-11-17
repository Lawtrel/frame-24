import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { Identity } from '../domain/entities/identity.entity';
import { IdentityMapper } from '../infraestructure/mappers/indentity.mapper';
import { IdentityRepository } from 'src/modules/identity/auth/repositories/identity.repository';

type MockPrismaService = {
  identities: {
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('IdentityRepository', () => {
  let repository: IdentityRepository;
  let prismaService: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityRepository,
        {
          provide: PrismaService,
          useValue: {
            identities: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<IdentityRepository>(IdentityRepository);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('deve retornar Identity quando encontrada', async () => {
      const raw = { id: '123', email: 'teste@mail.com' } as any;
      prismaService.identities.findFirst.mockResolvedValueOnce(raw);

      jest
        .spyOn(IdentityMapper, 'toDomain')
        .mockReturnValueOnce({} as Identity);

      const result = await repository.findByEmail('teste@mail.com');

      expect(prismaService.identities.findFirst).toHaveBeenCalledWith({
        where: { email: 'teste@mail.com' },
      });
      expect(result).toBeTruthy();
    });

    it('deve retornar null quando não encontrada', async () => {
      prismaService.identities.findFirst.mockResolvedValueOnce(null);

      const result = await repository.findByEmail('inexistente@mail.com');

      expect(result).toBeNull();
    });
  });

  describe('updatePasswordReset', () => {
    it('deve atualizar token de reset e expiração', async () => {
      const agora = new Date();
      const raw = {
        id: '123',
        reset_token: 'token123',
        reset_token_expires_at: agora,
      } as any;

      prismaService.identities.update.mockResolvedValueOnce(raw);
      jest
        .spyOn(IdentityMapper, 'toDomain')
        .mockReturnValueOnce({} as Identity);

      await repository.updatePasswordReset('123', {
        resetToken: 'token123',
        resetTokenExpiresAt: agora,
      });

      expect(prismaService.identities.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          reset_token: 'token123',
          reset_token_expires_at: agora,
        },
      });
    });
  });

  describe('updateLoginAttempts', () => {
    it('deve persistir informações de tentativa de login falhada', async () => {
      const agora = new Date();

      prismaService.identities.update.mockResolvedValueOnce({
        id: 'id-1',
      } as any);
      jest
        .spyOn(IdentityMapper, 'toDomain')
        .mockReturnValueOnce({} as Identity);

      await repository.updateLoginAttempts('id-1', {
        failedLoginAttempts: 3,
        lastFailedLogin: agora,
        blockedUntil: null,
        blockReason: null,
      });

      expect(prismaService.identities.update).toHaveBeenCalledWith({
        where: { id: 'id-1' },
        data: {
          failed_login_attempts: 3,
          last_failed_login: agora,
          blocked_until: null,
          block_reason: null,
        },
      });
    });
  });

  describe('completePasswordReset', () => {
    it('deve resetar senha e limpar dados de bloqueio', async () => {
      const agora = new Date();

      prismaService.identities.update.mockResolvedValueOnce({
        id: '123',
      } as any);
      jest
        .spyOn(IdentityMapper, 'toDomain')
        .mockReturnValueOnce({} as Identity);

      await repository.completePasswordReset('123', {
        passwordHash: 'novoHash',
        passwordChangedAt: agora,
      });

      expect(prismaService.identities.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          password_hash: 'novoHash',
          password_changed_at: agora,
          reset_token: null,
          reset_token_expires_at: null,
          failed_login_attempts: 0,
          blocked_until: null,
          block_reason: null,
        },
      });
    });
  });

  describe('createWithVerification', () => {
    it('deve criar novo funcionário com token de verificação', async () => {
      const mockData = {
        personId: 'p1',
        email: 'usuario@mail.com',
        passwordHash: 'hash123',
        verificationToken: 'token123',
        verificationExpiresAt: new Date(),
      };

      prismaService.identities.create.mockResolvedValueOnce({
        id: 'id-1',
      } as any);
      jest
        .spyOn(IdentityMapper, 'toDomain')
        .mockReturnValueOnce({} as Identity);

      await repository.createWithVerification(mockData);

      expect(prismaService.identities.create).toHaveBeenCalledWith({
        data: {
          persons: { connect: { id: 'p1' } },
          email: 'usuario@mail.com',
          identity_type: 'EMPLOYEE',
          password_hash: 'hash123',
          active: true,
          email_verified: false,
          email_verification_token: 'token123',
          email_verification_expires_at: mockData.verificationExpiresAt,
        },
      });
    });
  });

  describe('save', () => {
    it('deve persistir atualizações da identidade', async () => {
      const mockIdentity = { id: '123', props: {} } as unknown as Identity;
      const dadosPrisma = { email: 'atualizado@mail.com' };

      jest.spyOn(IdentityMapper, 'toPrisma').mockReturnValueOnce(dadosPrisma);
      jest
        .spyOn(IdentityMapper, 'toDomain')
        .mockReturnValueOnce({} as Identity);
      prismaService.identities.update.mockResolvedValueOnce({
        id: '123',
      } as any);

      await repository.save(mockIdentity);

      expect(prismaService.identities.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: dadosPrisma,
      });
    });
  });

  describe('delete', () => {
    it('deve deletar identidade por ID', async () => {
      prismaService.identities.delete.mockResolvedValueOnce({
        id: '999',
      } as any);

      await repository.delete('999');

      expect(prismaService.identities.delete).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });
});
