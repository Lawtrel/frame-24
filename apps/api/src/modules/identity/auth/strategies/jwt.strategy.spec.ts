import { UnauthorizedException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { LoggerService } from 'src/common/services/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload, JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: jest.Mocked<PrismaService>;
  let logger: jest.Mocked<LoggerService>;
  let cls: jest.Mocked<ClsService>;
  let userSessionsFindFirst: jest.Mock;
  let identitiesFindUnique: jest.Mock;
  let customersFindUnique: jest.Mock;
  let companiesFindUnique: jest.Mock;

  const basePayload: JwtPayload = {
    sub: 'identity-1',
    identity_id: 'identity-1',
    company_id: 'company-1',
    email: 'user@example.com',
    session_context: 'EMPLOYEE',
    iat: 1,
    exp: 999999,
  };

  beforeEach(() => {
    userSessionsFindFirst = jest.fn();
    identitiesFindUnique = jest.fn();
    customersFindUnique = jest.fn();
    companiesFindUnique = jest.fn();

    prisma = {
      user_sessions: { findFirst: userSessionsFindFirst },
      identities: { findUnique: identitiesFindUnique },
      customers: { findUnique: customersFindUnique },
      companies: { findUnique: companiesFindUnique },
    } as unknown as jest.Mocked<PrismaService>;

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    cls = {
      set: jest.fn(),
    } as unknown as jest.Mocked<ClsService>;

    strategy = new JwtStrategy(prisma, logger, cls);
  });

  it('should reject when session is invalid', async () => {
    userSessionsFindFirst.mockResolvedValue(null);

    await expect(strategy.validate(basePayload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should authenticate employee and set context', async () => {
    userSessionsFindFirst.mockResolvedValue({ id: 'session-1' });
    identitiesFindUnique.mockResolvedValue({
      id: 'identity-1',
      active: true,
      email: 'user@example.com',
      persons: { full_name: 'User One' },
      company_users: [
        {
          id: 'company-user-1',
          employee_id: 'EMP-1',
          company_id: 'company-1',
          companies: { active: true, tenant_slug: 'tenant-1' },
          custom_roles: {
            id: 'role-1',
            name: 'Admin',
            hierarchy_level: 1,
            role_permissions: [
              { permissions: { resource: 'users', action: 'read' } },
              { permissions: { resource: 'users', action: 'write' } },
            ],
          },
        },
      ],
    } as never);

    const result = await strategy.validate(basePayload);

    expect(result).toEqual(
      expect.objectContaining({
        session_context: 'EMPLOYEE',
        company_user_id: 'company-user-1',
        permissions: ['users:read', 'users:write'],
      }),
    );
    expect(cls.set).toHaveBeenCalledWith('companyId', 'company-1');
    expect(cls.set).toHaveBeenCalledWith('userId', 'company-user-1');
  });

  it('should reject employee without active company link', async () => {
    userSessionsFindFirst.mockResolvedValue({ id: 'session-1' });
    identitiesFindUnique.mockResolvedValue({
      id: 'identity-1',
      active: true,
      email: 'user@example.com',
      persons: { full_name: 'User One' },
      company_users: [],
    } as never);

    await expect(strategy.validate(basePayload)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should authenticate customer and set context', async () => {
    userSessionsFindFirst.mockResolvedValue({ id: 'session-1' });
    identitiesFindUnique.mockResolvedValue({
      id: 'identity-1',
      active: true,
      email: 'identity@example.com',
      persons: { full_name: 'Customer Name' },
      company_users: [],
    } as never);
    customersFindUnique.mockResolvedValue({
      id: 'customer-1',
      active: true,
      blocked: false,
      email: 'customer@example.com',
      full_name: 'Customer Name',
      company_customers: [
        {
          is_active_in_loyalty: true,
          loyalty_level: 'GOLD',
          accumulated_points: 120,
        },
      ],
    } as never);
    companiesFindUnique.mockResolvedValue({
      id: 'company-1',
      active: true,
      tenant_slug: 'tenant-1',
    } as never);

    const result = await strategy.validate({
      ...basePayload,
      session_context: 'CUSTOMER',
    });

    expect(result).toEqual(
      expect.objectContaining({
        session_context: 'CUSTOMER',
        customer_id: 'customer-1',
        loyalty_level: 'GOLD',
      }),
    );
    expect(cls.set).toHaveBeenCalledWith('companyId', 'company-1');
    expect(cls.set).toHaveBeenCalledWith('userId', 'customer-1');
  });

  it('should reject customer without company id', async () => {
    userSessionsFindFirst.mockResolvedValue({ id: 'session-1' });
    identitiesFindUnique.mockResolvedValue({
      id: 'identity-1',
      active: true,
      email: 'identity@example.com',
      persons: null,
      company_users: [],
    } as never);

    await expect(
      strategy.validate({
        ...basePayload,
        company_id: undefined,
        session_context: 'CUSTOMER',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
