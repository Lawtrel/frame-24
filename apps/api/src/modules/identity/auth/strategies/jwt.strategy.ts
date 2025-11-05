import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/services/logger.service';

export interface JwtPayload {
  sub: string;
  identity_id: string;
  company_id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface RequestUser {
  sub: string;
  identity_id: string;
  company_user_id: string;
  employee_id: string;
  email: string;
  name: string;
  tenant_slug: string;
  company_id: string;
  role: string;
  role_hierarchy: number;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    this.logger.debug(
      `Validando JWT: ${payload.identity_id}`,
      JwtStrategy.name,
    );

    const identity = await this.prisma.identities.findUnique({
      where: { id: payload.identity_id },
      include: {
        company_users: {
          where: {
            company_id: payload.company_id,
            active: true,
          },
          include: {
            companies: true,
            custom_roles: {
              include: {
                role_permissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
        persons: true,
      },
    });

    if (!identity || !identity.active) {
      throw new UnauthorizedException('Token inválido ou usuário inativo');
    }

    if (!identity.company_users || identity.company_users.length === 0) {
      throw new UnauthorizedException('Usuário não vinculado a empresa ativa');
    }

    const companyUser = identity.company_users[0];

    if (!companyUser.companies || !companyUser.companies.active) {
      throw new UnauthorizedException('Empresa inativa ou suspensa');
    }

    if (!companyUser.custom_roles) {
      throw new UnauthorizedException('Usuário sem perfil de acesso definido');
    }

    const permissions: string[] = [];
    if (companyUser.custom_roles.role_permissions) {
      companyUser.custom_roles.role_permissions.forEach((rp) => {
        const perm = rp.permissions;
        if (perm) {
          permissions.push(`${perm.resource}:${perm.action}`);
        }
      });
    }

    // Monta RequestUser
    const user: RequestUser = {
      sub: payload.sub,
      identity_id: payload.identity_id,
      company_user_id: payload.company_id,
      employee_id: companyUser.employee_id,
      email: payload.email,
      name: identity.persons?.full_name || payload.email,
      tenant_slug: companyUser.companies.tenant_slug,
      company_id: payload.company_id,
      role: companyUser.custom_roles.name,
      role_hierarchy: companyUser.custom_roles.hierarchy_level ?? 99,
      permissions,
    };

    this.logger.debug(
      `Auth OK: ${user.email} | ${user.role}`,
      JwtStrategy.name,
    );

    return user;
  }
}
