import { Injectable } from '@nestjs/common';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { SessionLanguagesRepository } from '../repositories/session-languages.repository';

@Injectable()
export class SessionLanguagesService {
  constructor(private readonly repository: SessionLanguagesRepository) {}

  async findAll(user: RequestUser) {
    return this.repository.findAllByCompany(user.company_id);
  }
}
