import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import * as bcrypt from 'bcrypt';
import { persons, Prisma } from '@repo/db';

import { SnowflakeService } from 'src/common/services/snowflake.service';
import { LoggerService } from 'src/common/services/logger.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { IdentityRepository } from 'src/modules/identity/auth/repositories/identity.repository';
import { PersonRepository } from 'src/modules/identity/auth/repositories/person.repository';
import {
  CompanyUserRepository,
  CompanyUserWithRelations,
} from 'src/modules/identity/auth/repositories/company-user.repository';
import { CustomRoleRepository } from 'src/modules/identity/auth/repositories/custom-role.repository';
import { EmployeeIdGeneratorService } from 'src/modules/identity/auth/services/employee-id-generator';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly personRepository: PersonRepository,
    private readonly companyUserRepository: CompanyUserRepository,
    private readonly customRoleRepository: CustomRoleRepository,
    private readonly employeeIdGenerator: EmployeeIdGeneratorService,
    private readonly snowflake: SnowflakeService,
    private readonly logger: LoggerService,
  ) {}

  @Transactional()
  async create(
    dto: CreateUserDto,
    company_id: string,
  ): Promise<UserResponseDto> {
    this.logger.log(
      `Creating user: ${dto.email} @ ${company_id}`,
      UsersService.name,
    );

    const role = await this.customRoleRepository.findByIdAndCompany(
      dto.role_id,
      company_id,
    );

    if (!role) {
      throw new BadRequestException(
        'Role inválida ou não pertence a esta empresa.',
      );
    }

    const existingIdentity =
      await this.identityRepository.findByEmailAndCompany(
        dto.email,
        company_id,
        'EMPLOYEE',
      );

    if (existingIdentity) {
      throw new ConflictException(
        'Já existe um usuário com este email nesta empresa.',
      );
    }

    let person: persons;

    if (dto.cpf) {
      const existingPerson = await this.personRepository.findByCpf(
        this.normalizeCpf(dto.cpf),
      );

      if (existingPerson) {
        this.logger.log(
          `Reusing existing person: ${existingPerson.id} (CPF: ${dto.cpf})`,
          UsersService.name,
        );

        person = existingPerson;

        if (dto.full_name || dto.mobile || dto.email) {
          person = await this.personRepository.update(existingPerson.id, {
            ...(dto.full_name && { full_name: dto.full_name }),
            ...(dto.mobile && { mobile: dto.mobile }),
            ...(dto.email && { email: dto.email }),
          });
        }
      } else {
        person = await this.personRepository.create({
          full_name: dto.full_name,
          cpf: this.normalizeCpf(dto.cpf),
          birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined,
          phone: dto.phone,
          mobile: dto.mobile,
          email: dto.email,
          zip_code: dto.zip_code,
          street_address: dto.street_address,
          address_number: dto.address_number,
          address_complement: dto.address_complement,
          neighborhood: dto.neighborhood,
          city: dto.city,
          state: dto.state,
          country: dto.country,
        } as Prisma.personsCreateInput);

        this.logger.log(`Person created: ${person.id}`, UsersService.name);
      }
    } else {
      person = await this.personRepository.create({
        full_name: dto.full_name,
        birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined,
        phone: dto.phone,
        mobile: dto.mobile,
        email: dto.email,
        zip_code: dto.zip_code,
        street_address: dto.street_address,
        address_number: dto.address_number,
        address_complement: dto.address_complement,
        neighborhood: dto.neighborhood,
        city: dto.city,
        state: dto.state,
        country: dto.country,
      } as Prisma.personsCreateInput);

      this.logger.log(`Person created: ${person.id}`, UsersService.name);
    }

    const password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const identity = await this.identityRepository.create({
      persons: { connect: { id: person.id } },
      email: dto.email,
      identity_type: 'EMPLOYEE',
      password_hash,
      active: dto.active ?? true,
      email_verified: false,
    } as Prisma.identitiesCreateInput);

    this.logger.log(`Identity created: ${identity.id}`, UsersService.name);

    const employee_id = await this.employeeIdGenerator.generate(company_id);

    this.logger.log(
      `Generated employee_id: ${employee_id} for ${dto.email}`,
      UsersService.name,
    );

    const companyUser = await this.companyUserRepository.create({
      identities: { connect: { id: identity.id } },
      companies: { connect: { id: company_id } },
      custom_roles: { connect: { id: dto.role_id } },
      employee_id,
      department: dto.department,
      job_level: dto.job_level,
      location: dto.location,
      allowed_complexes: dto.allowed_complexes
        ? JSON.stringify(dto.allowed_complexes)
        : undefined,
      ip_whitelist: dto.ip_whitelist
        ? JSON.stringify(dto.ip_whitelist)
        : undefined,
      active: dto.active ?? true,
      start_date: dto.start_date ? new Date(dto.start_date) : new Date(),
      end_date: dto.end_date ? new Date(dto.end_date) : undefined,
    } as Prisma.company_usersCreateInput);

    this.logger.log(
      `User created successfully: ${identity.email}`,
      UsersService.name,
    );

    return this.mapToResponseDto(companyUser);
  }

  async findAll(company_id: string): Promise<UserResponseDto[]> {
    const companyUsers =
      await this.companyUserRepository.findAllByCompany(company_id);

    const result: UserResponseDto[] = companyUsers.map((cu) =>
      this.mapToResponseDto(cu),
    );

    return result;
  }

  async findOne(
    employee_id: string,
    company_id: string,
  ): Promise<UserResponseDto> {
    const companyUser =
      await this.companyUserRepository.findByEmployeeIdAndCompany(
        employee_id,
        company_id,
      );

    if (!companyUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.mapToResponseDto(companyUser);
  }

  @Transactional()
  async update(
    employee_id: string,
    dto: UpdateUserDto,
    company_id: string,
  ): Promise<UserResponseDto> {
    const companyUser =
      await this.companyUserRepository.findByEmployeeIdAndCompany(
        employee_id,
        company_id,
      );

    if (!companyUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (dto.role_id && dto.role_id !== companyUser.role_id) {
      const role = await this.customRoleRepository.findByIdAndCompany(
        dto.role_id,
        company_id,
      );

      if (!role) {
        throw new BadRequestException(
          'Role inválida ou não pertence a esta empresa.',
        );
      }
    }

    const personId = companyUser.identities.person_id;

    if (!personId) {
      throw new NotFoundException('Person ID is missing');
    }

    if (
      dto.full_name ||
      dto.cpf ||
      dto.birth_date ||
      dto.phone ||
      dto.mobile ||
      dto.email ||
      dto.zip_code ||
      dto.street_address ||
      dto.address_number ||
      dto.address_complement ||
      dto.neighborhood ||
      dto.city ||
      dto.state ||
      dto.country
    ) {
      await this.personRepository.update(personId, {
        ...(dto.full_name && { full_name: dto.full_name }),
        ...(dto.cpf && { cpf: this.normalizeCpf(dto.cpf) }),
        ...(dto.birth_date && { birth_date: new Date(dto.birth_date) }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.mobile && { mobile: dto.mobile }),
        ...(dto.email && { email: dto.email }),
        ...(dto.zip_code && { zip_code: dto.zip_code }),
        ...(dto.street_address && { street_address: dto.street_address }),
        ...(dto.address_number && { address_number: dto.address_number }),
        ...(dto.address_complement && {
          address_complement: dto.address_complement,
        }),
        ...(dto.neighborhood && { neighborhood: dto.neighborhood }),
        ...(dto.city && { city: dto.city }),
        ...(dto.state && { state: dto.state }),
        ...(dto.country && { country: dto.country }),
      });
    }

    if (dto.email && dto.email !== companyUser.identities.email) {
      await this.identityRepository.update(companyUser.identity_id, {
        email: dto.email,
        email_verified: false,
      });
    }

    const updatedCompanyUser = await this.companyUserRepository.update(
      companyUser.id,
      {
        ...(dto.role_id && {
          custom_roles: { connect: { id: dto.role_id } },
        }),
        ...(dto.department !== undefined && { department: dto.department }),
        ...(dto.job_level !== undefined && { job_level: dto.job_level }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.allowed_complexes && {
          allowed_complexes: JSON.stringify(dto.allowed_complexes),
        }),
        ...(dto.ip_whitelist && {
          ip_whitelist: JSON.stringify(dto.ip_whitelist),
        }),
        ...(dto.active !== undefined && { active: dto.active }),
        ...(dto.start_date && { start_date: new Date(dto.start_date) }),
        ...(dto.end_date !== undefined && {
          end_date: dto.end_date ? new Date(dto.end_date) : null,
        }),
      },
    );

    this.logger.log(`User updated: ${employee_id}`, UsersService.name);

    return this.mapToResponseDto(updatedCompanyUser);
  }

  async softDelete(employee_id: string, company_id: string): Promise<void> {
    const companyUser =
      await this.companyUserRepository.findByEmployeeIdAndCompany(
        employee_id,
        company_id,
      );

    if (!companyUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.companyUserRepository.softDelete(companyUser.id);

    this.logger.log(`User soft deleted: ${employee_id}`, UsersService.name);
  }

  private mapToResponseDto(
    companyUser: CompanyUserWithRelations,
  ): UserResponseDto {
    if (!companyUser.identities.persons) {
      throw new BadRequestException('Person data is missing');
    }

    const person = companyUser.identities.persons;

    const result: UserResponseDto = {
      employee_id: companyUser.employee_id,
      full_name: person.full_name,
      email: companyUser.identities.email,
      cpf: person.cpf,
      mobile: person.mobile,
      company_user: {
        id: companyUser.id,
        employee_id: companyUser.employee_id,
        role_id: companyUser.role_id,
        role_name: companyUser.custom_roles.name,
        department: companyUser.department,
        job_level: companyUser.job_level,
        active: companyUser.active ?? false,
        start_date: companyUser.start_date?.toISOString() ?? '',
        end_date: companyUser.end_date?.toISOString() ?? null,
        last_access: companyUser.last_access?.toISOString() ?? null,
      },
      created_at: companyUser.created_at?.toISOString() ?? '',
      updated_at: companyUser.updated_at?.toISOString() ?? '',
    };

    return result;
  }

  private normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }
}
