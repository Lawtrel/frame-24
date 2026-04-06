import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TenantContextService } from '../services/tenant-context.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;
  let tenantContext: jest.Mocked<TenantContextService>;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    tenantContext = {
      setContext: jest.fn(),
    } as unknown as jest.Mocked<TenantContextService>;

    prisma = {} as jest.Mocked<PrismaService>;

    guard = new JwtAuthGuard(reflector, tenantContext, prisma);
  });

  const createContext = (authorization?: string): ExecutionContext => {
    const request = {
      headers: {
        ...(authorization ? { authorization } : {}),
      },
    } as any;

    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow public routes without calling passport strategy', async () => {
    const context = createContext();
    reflector.getAllAndOverride.mockReturnValue(true);

    const parentCanActivate = jest.spyOn(
      Object.getPrototypeOf(JwtAuthGuard.prototype),
      'canActivate',
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(parentCanActivate).not.toHaveBeenCalled();
  });

  it('should call passport canActivate for protected routes with bearer token', async () => {
    const context = createContext('Bearer token');
    reflector.getAllAndOverride.mockReturnValue(false);

    const parentCanActivate = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(parentCanActivate).toHaveBeenCalledWith(context);
  });

  it('should call setContext in handleRequest when user is authenticated', () => {
    const context = createContext();
    const user = {
      identity_id: 'identity-1',
      company_id: 'company-1',
      company_user_id: 'user-1',
      session_context: 'EMPLOYEE',
    } as any;

    jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'handleRequest')
      .mockReturnValue(user);

    const result = guard.handleRequest(null, user, null, context);

    expect(result).toBe(user);
    expect(tenantContext.setContext).toHaveBeenCalledWith(user);
  });

  it('should not call setContext when authenticated user is empty', () => {
    const context = createContext();

    jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'handleRequest')
      .mockReturnValue(undefined);

    const result = guard.handleRequest(null, undefined as any, null, context);

    expect(result).toBeUndefined();
    expect(tenantContext.setContext).not.toHaveBeenCalled();
  });
});
