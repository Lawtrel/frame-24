import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/common/services/logger.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { IdentityRepository } from 'src/modules/identity/auth/repositories/identity.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyCustomersRepository } from '../repositories/company-customers.repository';
import { CustomersRepository } from '../repositories/customers.repository';
import { CustomerAuthService } from './customer-auth.service';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () =>
    (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('CustomerAuthService', () => {
  let service: CustomerAuthService;
  let customersRepository: jest.Mocked<CustomersRepository>;
  let companyCustomersRepository: jest.Mocked<CompanyCustomersRepository>;
  let identityRepository: jest.Mocked<IdentityRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let prisma: jest.Mocked<PrismaService>;
  let snowflake: jest.Mocked<SnowflakeService>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    customersRepository = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
      findByIdentityId: jest.fn(),
    } as unknown as jest.Mocked<CustomersRepository>;

    companyCustomersRepository = {
      create: jest.fn(),
      findByCompanyAndCustomer: jest.fn(),
    } as unknown as jest.Mocked<CompanyCustomersRepository>;

    identityRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<IdentityRepository>;

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    prisma = {
      companies: {
        findUnique: jest.fn(),
      },
      identities: {
        create: jest.fn(),
      },
      user_sessions: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    snowflake = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<SnowflakeService>;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new CustomerAuthService(
      customersRepository,
      companyCustomersRepository,
      identityRepository,
      jwtService,
      prisma,
      snowflake,
      logger,
    );

    snowflake.generate
      .mockReturnValueOnce('identity-1')
      .mockReturnValueOnce('session-1')
      .mockReturnValue('session-row-1');
    jwtService.sign.mockReturnValue('jwt-token');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  it('should register customer on happy path', async () => {
    prisma.companies.findUnique.mockResolvedValue({
      id: 'company-1',
      active: true,
      suspended: false,
      tenant_slug: 'cinema-central',
    } as never);
    customersRepository.findByEmail.mockResolvedValue(null);
    customersRepository.findByCpf.mockResolvedValue(null);
    prisma.identities.create.mockResolvedValue({ id: 'identity-1' } as never);
    customersRepository.create.mockResolvedValue({
      id: 'customer-1',
      full_name: 'Maria',
      email: 'maria@x.com',
    } as never);
    companyCustomersRepository.create.mockResolvedValue({
      loyalty_level: 'BRONZE',
      accumulated_points: 0,
    } as never);
    prisma.user_sessions.create.mockResolvedValue({ id: 'session-row-1' } as never);

    const result = await service.register({
      company_id: 'company-1',
      email: 'maria@x.com',
      cpf: '12345678900',
      full_name: 'Maria',
      phone: '11999999999',
      password: 'StrongPass123!',
    } as any);

    expect(prisma.identities.create).toHaveBeenCalled();
    expect(prisma.user_sessions.create).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        access_token: 'jwt-token',
        customer: expect.objectContaining({
          id: 'customer-1',
          company_id: 'company-1',
        }),
      }),
    );
  });

  it('should block register when company is inactive', async () => {
    prisma.companies.findUnique.mockResolvedValue({
      id: 'company-1',
      active: false,
      suspended: false,
    } as never);

    await expect(
      service.register({ company_id: 'company-1' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should block register on duplicate email', async () => {
    prisma.companies.findUnique.mockResolvedValue({
      id: 'company-1',
      active: true,
      suspended: false,
    } as never);
    customersRepository.findByEmail.mockResolvedValue({ id: 'existing' } as never);

    await expect(
      service.register({
        company_id: 'company-1',
        email: 'maria@x.com',
      } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should login customer on happy path', async () => {
    prisma.companies.findUnique.mockResolvedValue({
      id: 'company-1',
      active: true,
      suspended: false,
      tenant_slug: 'cinema-central',
    } as never);
    identityRepository.findByEmail.mockResolvedValue({
      id: 'identity-1',
      identityType: 'CUSTOMER',
      passwordHash: 'hashed-password',
      active: true,
    } as never);
    customersRepository.findByIdentityId.mockResolvedValue({
      id: 'customer-1',
      full_name: 'Maria',
      email: 'maria@x.com',
      active: true,
      blocked: false,
    } as never);
    companyCustomersRepository.findByCompanyAndCustomer.mockResolvedValue({
      is_active_in_loyalty: true,
      loyalty_level: 'SILVER',
      accumulated_points: 120,
    } as never);
    prisma.user_sessions.create.mockResolvedValue({ id: 'session-row-1' } as never);

    const result = await service.login({
      company_id: 'company-1',
      email: 'maria@x.com',
      password: 'StrongPass123!',
    } as any);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(result.customer.loyalty_level).toBe('SILVER');
    expect(result.access_token).toBe('jwt-token');
  });

  it('should reject login when password is invalid', async () => {
    prisma.companies.findUnique.mockResolvedValue({
      id: 'company-1',
      active: true,
      suspended: false,
    } as never);
    identityRepository.findByEmail.mockResolvedValue({
      id: 'identity-1',
      identityType: 'CUSTOMER',
      passwordHash: 'hashed-password',
      active: true,
    } as never);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        company_id: 'company-1',
        email: 'maria@x.com',
        password: 'wrong',
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject login when customer is blocked', async () => {
    prisma.companies.findUnique.mockResolvedValue({
      id: 'company-1',
      active: true,
      suspended: false,
    } as never);
    identityRepository.findByEmail.mockResolvedValue({
      id: 'identity-1',
      identityType: 'CUSTOMER',
      passwordHash: 'hashed-password',
      active: true,
    } as never);
    customersRepository.findByIdentityId.mockResolvedValue({
      id: 'customer-1',
      active: true,
      blocked: true,
    } as never);

    await expect(
      service.login({
        company_id: 'company-1',
        email: 'maria@x.com',
        password: 'StrongPass123!',
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });
});
