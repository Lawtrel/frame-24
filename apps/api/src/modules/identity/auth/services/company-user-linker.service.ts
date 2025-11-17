import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyUser } from '../domain/entities/company-user.entity';
import { CompanyUserRepository } from 'src/modules/identity/auth/repositories/company-user.repository';
import { CustomRoleRepository } from 'src/modules/identity/auth/repositories/custom-role.repository';
import { EmployeeIdGeneratorService } from 'src/modules/identity/auth/services/employee-id-generator'; // ✅ Entity

@Injectable()
export class CompanyUserLinkerService {
  constructor(
    private readonly companyUserRepository: CompanyUserRepository,
    private readonly customRoleRepository: CustomRoleRepository,
    private readonly employeeIdGenerator: EmployeeIdGeneratorService,
  ) {}

  async linkToCompany(
    identityId: string,
    companyId: string,
    roleId?: string,
  ): Promise<CompanyUser> {
    let finalRoleId = roleId;

    if (!finalRoleId) {
      const defaultRole =
        await this.customRoleRepository.findDefaultRole(companyId);
      if (!defaultRole) {
        throw new NotFoundException('Role padrão não encontrada.');
      }
      finalRoleId = defaultRole.id;
    }

    const employeeId = await this.employeeIdGenerator.generate(companyId);

    return this.companyUserRepository.create(
      identityId,
      companyId,
      finalRoleId,
      employeeId,
    );
  }

  async createAdminUser(
    identityId: string,
    companyId: string,
  ): Promise<CompanyUser> {
    const adminRole =
      await this.customRoleRepository.createAdminRole(companyId);

    return this.linkToCompany(identityId, companyId, adminRole.id);
  }
}
