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

    if (
      authenticatedUser &&
      'company_id' in authenticatedUser &&
      authenticatedUser.company_id
    ) {
      this.cls.set('companyId', authenticatedUser.company_id);
    }

    if (
      authenticatedUser &&
      'company_user_id' in authenticatedUser &&
      authenticatedUser.company_user_id
    ) {
      this.cls.set('userId', authenticatedUser.company_user_id);
    } else if (
      authenticatedUser &&
      'customer_id' in authenticatedUser &&
      authenticatedUser.customer_id
    ) {
      this.cls.set('userId', authenticatedUser.customer_id);
    }

    if (
      authenticatedUser &&
      'identity_id' in authenticatedUser &&
      authenticatedUser.identity_id
    ) {
      this.cls.set('identityId', authenticatedUser.identity_id);
    }

    if (
      authenticatedUser &&
      'role_hierarchy' in authenticatedUser &&
      typeof authenticatedUser.role_hierarchy === 'number'
    ) {
      this.cls.set('roleHierarchy', authenticatedUser.role_hierarchy);
    }

    if (
      authenticatedUser &&
      'session_context' in authenticatedUser &&
      authenticatedUser.session_context
    ) {
      this.cls.set('sessionContext', authenticatedUser.session_context);
    }

    if (
      authenticatedUser &&
      'customer_id' in authenticatedUser &&
      authenticatedUser.customer_id
    ) {
      this.cls.set('customerId', authenticatedUser.customer_id);
    }

    if (
      authenticatedUser &&
      'tenant_slug' in authenticatedUser &&
      authenticatedUser.tenant_slug
    ) {
      this.cls.set('tenantSlug', authenticatedUser.tenant_slug);
    }

    return authenticatedUser;
  }
}
