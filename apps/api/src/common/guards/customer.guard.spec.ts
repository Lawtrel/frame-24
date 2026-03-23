import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CustomerGuard } from './customer.guard';

describe('CustomerGuard', () => {
  let guard: CustomerGuard;

  beforeEach(() => {
    guard = new CustomerGuard();
  });

  const createContext = (user: unknown): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as ExecutionContext;

  it('should allow authenticated customer context', () => {
    const context = createContext({
      customer_id: 'customer-1',
      session_context: 'CUSTOMER',
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should block when user is missing', () => {
    const context = createContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow('Cliente não autenticado');
  });

  it('should block when session context is not CUSTOMER', () => {
    const context = createContext({
      company_user_id: 'user-1',
      session_context: 'EMPLOYEE',
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow(
      'Acesso permitido apenas para clientes',
    );
  });
});
