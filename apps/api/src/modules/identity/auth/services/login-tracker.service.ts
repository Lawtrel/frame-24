import { Injectable } from '@nestjs/common';
import { IdentityRepository } from '../repositories/identity.repository';
import { CompanyUserRepository } from '../repositories/company-user.repository';

@Injectable()
export class LoginTrackerService {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly companyUserRepository: CompanyUserRepository,
  ) {}

  async track(identityId: string, companyUserId: string): Promise<void> {
    const [identity, companyUser] = await Promise.all([
      this.identityRepository.findById(identityId),
      this.companyUserRepository.findById(companyUserId),
    ]);

    await Promise.all([
      this.identityRepository.updateLoginTracking(identityId, {
        lastLoginDate: new Date(),
        loginCount: (identity?.loginCount ?? 0) + 1,
      }),
      this.companyUserRepository.updateAccessTracking(companyUserId, {
        lastAccess: new Date(),
        accessCount: (companyUser?.accessCount ?? 0) + 1,
      }),
    ]);
  }
}
