import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TenantContextService } from '../services/tenant-context.service';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;
  let tenantContext: jest.Mocked<TenantContextService>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    tenantContext = {
      setContext: jest.fn(),
    } as unknown as jest.Mocked<TenantContextService>;

    guard = new JwtAuthGuard(reflector, tenantContext);
  });

  const createContext = (): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    }) as unknown as ExecutionContext;

  it('should allow public routes without calling passport strategy', () => {
    const context = createContext();
    reflector.getAllAndOverride.mockReturnValue(true);

    const parentCanActivate = jest.spyOn(
      Object.getPrototypeOf(JwtAuthGuard.prototype),
      'canActivate',
    );

    expect(guard.canActivate(context)).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(parentCanActivate).not.toHaveBeenCalled();
  });

  it('should call passport canActivate for protected routes', () => {
    const context = createContext();
    reflector.getAllAndOverride.mockReturnValue(false);

    const parentCanActivate = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    expect(guard.canActivate(context)).toBe(true);
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
