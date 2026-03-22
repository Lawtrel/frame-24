import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ClsService } from 'nestjs-cls';
import type {
  RequestUser,
  CustomerUser,
} from 'src/modules/identity/auth/strategies/jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly cls: ClsService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Permite acesso sem autenticação
    }

    return super.canActivate(context);
  }

  handleRequest<TUser extends RequestUser | CustomerUser>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    const authenticatedUser = super.handleRequest<TUser>(
      err,
      user,
      info,
      context,
    );

    if (authenticatedUser) {
      this.setClsFromUser(authenticatedUser);
    }

    return authenticatedUser;
  }

  private setClsFromUser(user: RequestUser | CustomerUser): void {
    const fieldMap: Array<{ field: string; clsKey: string; typeCheck?: string }> = [
      { field: 'company_id', clsKey: 'companyId' },
      { field: 'company_user_id', clsKey: 'userId' },
      { field: 'identity_id', clsKey: 'identityId' },
      { field: 'role_hierarchy', clsKey: 'roleHierarchy', typeCheck: 'number' },
      { field: 'session_context', clsKey: 'sessionContext' },
      { field: 'customer_id', clsKey: 'customerId' },
      { field: 'tenant_slug', clsKey: 'tenantSlug' },
    ];

    const record = user as unknown as Record<string, unknown>;

    for (const { field, clsKey, typeCheck } of fieldMap) {
      if (!(field in user)) continue;
      const value = record[field];
      if (value == null) continue;
      if (typeCheck && typeof value !== typeCheck) continue;
      this.cls.set(clsKey, value);
    }

    // userId fallback: use customer_id when company_user_id is not present
    if (
      !('company_user_id' in user) &&
      'customer_id' in user &&
      record.customer_id
    ) {
      this.cls.set('userId', record.customer_id);
    }
  }
}
