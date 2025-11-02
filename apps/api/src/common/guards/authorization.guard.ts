import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../services/logger.service';
import { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logger: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (this.isAdmin(user)) {
      this.logger.debug(
        `Admin bypass: ${user.email} | ${requiredPermission}`,
        AuthorizationGuard.name,
      );
      return true;
    }

    const hasPermission = user.permissions.includes(requiredPermission);

    if (!hasPermission) {
      this.logger.warn(
        `Acesso negado: ${user.email} tentou ${requiredPermission}`,
        AuthorizationGuard.name,
      );
      throw new ForbiddenException(`Sem permissão: ${requiredPermission}`);
    }

    return true;
  }

  private isAdmin(user: RequestUser): boolean {
    const adminRoles = ['Super Admin', 'Admin'];
    return adminRoles.includes(user.role);
  }
}
