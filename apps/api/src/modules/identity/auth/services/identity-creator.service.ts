import { Injectable } from '@nestjs/common';
import { Identity } from '../domain/entities/identity.entity';
import { Person } from '../domain/entities/person.entity';
import { IdentityRepository } from '../repositories/identity.repository';
import { PersonRepository } from '../repositories/person.repository';
import { Email } from '../domain/value-objects/email.value-object';
import { Password } from '../domain/value-objects/password.value-object';
import { Mobile } from '../domain/value-objects/mobile.value-object';
import {
  EmailVerificationService,
  VerificationToken,
} from './email-verification.service';

export interface CreateIdentityData {
  email: string;
  password: string;
  fullName: string;
  mobile?: string;
}

export interface IdentityWithPerson {
  identity: Identity;
  person: Person;
  verification: VerificationToken;
}

@Injectable()
export class IdentityCreatorService {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly personRepository: PersonRepository,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async create(data: CreateIdentityData): Promise<IdentityWithPerson> {
    const email = Email.create(data.email);
    const password = await Password.create(data.password);
    const mobile = data.mobile ? Mobile.create(data.mobile) : undefined;

    const verification = this.emailVerificationService.generateToken();

    const person = await this.personRepository.create(
      data.fullName,
      email.value,
      mobile?.value,
    );

    const identity = await this.identityRepository.createWithVerification({
      personId: person.id,
      email: email.value,
      passwordHash: password.hash,
      verificationToken: verification.token,
      verificationExpiresAt: verification.expiresAt,
    });

    return { identity, person, verification };
  }
}
