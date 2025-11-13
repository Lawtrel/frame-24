import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Identity } from '../domain/entities/identity.entity';
import { CompanyUser } from '../domain/entities/company-user.entity';
import { LoginResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class TokenGeneratorService {
  constructor(private readonly jwtService: JwtService) {}

  generate(identity: Identity, companyUser: CompanyUser): LoginResponseDto {
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
}
