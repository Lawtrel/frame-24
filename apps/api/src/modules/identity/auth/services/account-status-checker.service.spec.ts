import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AccountStatusCheckerService } from './account-status-checker.service';
import { Identity } from '../domain/entities/identity.entity';

describe('AccountStatusCheckerService', () => {
  let service: AccountStatusCheckerService;

  const mockIdentity: Identity = {
    id: 'identity-123',
    active: true,
    emailVerified: true,
    canLogin: jest.fn().mockReturnValue(true),
    isBlocked: jest.fn().mockReturnValue(false),
    blockedUntil: null,
  } as unknown as Identity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountStatusCheckerService],
    }).compile();

    service = module.get<AccountStatusCheckerService>(
      AccountStatusCheckerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('não deve lançar erro quando conta estiver válida', () => {
      expect(() => service.check(mockIdentity)).not.toThrow();
    });

    it('deve chamar canLogin da entidade', () => {
      service.check(mockIdentity);

      expect(mockIdentity.canLogin).toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando conta estiver bloqueada', () => {
      const blockedDate = new Date('2025-12-31T23:59:59.000Z');
      const blockedIdentity = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(true),
        blockedUntil: blockedDate,
      } as unknown as Identity;

      expect(() => service.check(blockedIdentity)).toThrow(
        UnauthorizedException,
      );
      expect(() => service.check(blockedIdentity)).toThrow(
        `Conta bloqueada até ${blockedDate.toISOString()}`,
      );
    });

    it('deve lançar UnauthorizedException quando conta estiver desativada', () => {
      const inactiveIdentity = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(false),
        active: false,
      } as unknown as Identity;

      expect(() => service.check(inactiveIdentity)).toThrow(
        UnauthorizedException,
      );
      expect(() => service.check(inactiveIdentity)).toThrow('Conta desativada');
    });

    it('deve lançar UnauthorizedException quando email não estiver verificado', () => {
      const unverifiedIdentity = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(false),
        active: true,
        emailVerified: false,
      } as unknown as Identity;

      expect(() => service.check(unverifiedIdentity)).toThrow(
        UnauthorizedException,
      );
      expect(() => service.check(unverifiedIdentity)).toThrow(
        'Email não verificado. Por favor, verifique seu email antes de fazer login',
      );
    });

    it('deve lançar erro genérico quando motivo não for específico', () => {
      const genericInvalidIdentity = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(false),
        active: true,
        emailVerified: true,
      } as unknown as Identity;

      expect(() => service.check(genericInvalidIdentity)).toThrow(
        UnauthorizedException,
      );
      expect(() => service.check(genericInvalidIdentity)).toThrow(
        'Não autorizado',
      );
    });

    it('deve priorizar erro de bloqueio sobre outros erros', () => {
      const blockedAndInactive = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(true),
        blockedUntil: new Date('2025-12-31'),
        active: false,
        emailVerified: false,
      } as unknown as Identity;

      expect(() => service.check(blockedAndInactive)).toThrow(
        'Conta bloqueada até',
      );
    });

    it('deve priorizar erro de desativação sobre email não verificado', () => {
      const inactiveUnverified = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(false),
        active: false,
        emailVerified: false,
      } as unknown as Identity;

      expect(() => service.check(inactiveUnverified)).toThrow(
        'Conta desativada',
      );
    });

    it('deve chamar isBlocked quando canLogin retornar false', () => {
      const invalidIdentity = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(false),
        active: true,
        emailVerified: true,
      } as unknown as Identity;

      try {
        service.check(invalidIdentity);
      } catch {
        // Esperado
      }

      expect(invalidIdentity.isBlocked).toHaveBeenCalled();
    });

    it('deve incluir data ISO no erro de bloqueio', () => {
      const blockedDate = new Date('2025-12-31T23:59:59.000Z');
      const blockedIdentity = {
        ...mockIdentity,
        canLogin: jest.fn().mockReturnValue(false),
        isBlocked: jest.fn().mockReturnValue(true),
        blockedUntil: blockedDate,
      } as unknown as Identity;

      expect(() => service.check(blockedIdentity)).toThrow(
        blockedDate.toISOString(),
      );
    });
  });
});
