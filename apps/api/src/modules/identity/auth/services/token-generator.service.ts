import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Identity } from '../domain/entities/identity.entity';
import { CompanyUser } from '../domain/entities/company-user.entity';
import { LoginResponseDto } from '../dto/auth-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { createHash } from 'crypto';

@Injectable()
export class TokenGeneratorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) { }

  async generate(
    identity: Identity,
    companyUser: CompanyUser,
  ): Promise<LoginResponseDto> {
    const payload = {
      sub: identity.id,
      identity_id: identity.id,
      company_id: companyUser.companyId,
      email: identity.email,
      company_user_id: companyUser.id,
      role_id: companyUser.roleId,
      session_context: 'EMPLOYEE' as const,
    };

    const access_token = this.jwtService.sign(payload);

    // Security: Store session in database for token revocation
    const sessionId = this.snowflake.generate();
    const tokenHash = this.hashToken(access_token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.prisma.user_sessions.create({
      data: {
        id: sessionId,
        identity_id: identity.id,
        company_id: companyUser.companyId,
        access_token_hash: tokenHash,
        session_id: sessionId,
        session_context: 'EMPLOYEE',
        expires_at: expiresAt,
        active: true,
        revoked: false,
      },
    });

    return {
      access_token,
      user: {
        id: identity.id,
        email: identity.email,
        company_id: companyUser.companyId,
        role_id: companyUser.roleId,
        employee_id: companyUser.employeeId,
      },
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
