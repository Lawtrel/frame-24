import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ClsService } from 'nestjs-cls';
import type { RequestUser, CustomerUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

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
    const authenticatedUser = super.handleRequest(
      err,
      user,
      info,
      context,
    ) as TUser;

    if (
      authenticatedUser &&
      'company_id' in authenticatedUser &&
      authenticatedUser.company_id
    ) {
      this.cls.set('companyId', authenticatedUser.company_id);
    }

    return authenticatedUser;
  }
}
