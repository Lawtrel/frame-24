import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenGeneratorService } from './token-generator.service';
import { Identity } from '../domain/entities/identity.entity';
import { CompanyUser } from '../domain/entities/company-user.entity';

describe('TokenGeneratorService', () => {
  let service: TokenGeneratorService;
  let jwtService: jest.Mocked<JwtService>;

  const mockIdentity: Identity = {
    id: 'identity-123',
    email: 'usuario@example.com',
    personId: 'person-123',
    identityType: 'EMPLOYEE',
    passwordHash: 'hash',
    active: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Identity;

  const mockCompanyUser: CompanyUser = {
    id: 'company-user-456',
    identityId: 'identity-123',
    companyId: 'company-789',
    roleId: 'role-admin',
    employeeId: 'EMP001',
    active: true,
    startDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as CompanyUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGeneratorService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
          },
        },
      ],
    }).compile();

    service = module.get<TokenGeneratorService>(TokenGeneratorService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('deve gerar um token JWT com sucesso', () => {
      const result = service.generate(mockIdentity, mockCompanyUser);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('mock.jwt.token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('deve criar payload JWT com todas as informações necessárias', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'identity-123',
        identity_id: 'identity-123',
        company_id: 'company-789',
        email: 'usuario@example.com',
        company_user_id: 'company-user-456',
        role_id: 'role-admin',
        session_context: 'EMPLOYEE',
      });
    });

    it('deve incluir sub (subject) como identity_id', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockIdentity.id,
          identity_id: mockIdentity.id,
        }),
      );
    });

    it('deve incluir email do usuário no payload', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockIdentity.email,
        }),
      );
    });

    it('deve incluir company_id no payload', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          company_id: mockCompanyUser.companyId,
        }),
      );
    });

    it('deve incluir role_id no payload para controle de permissões', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          role_id: mockCompanyUser.roleId,
        }),
      );
    });

    it('deve incluir company_user_id no payload', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          company_user_id: mockCompanyUser.id,
        }),
      );
    });

    it('deve definir session_context como EMPLOYEE', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          session_context: 'EMPLOYEE',
        }),
      );
    });

    it('deve retornar LoginResponseDto com estrutura correta', () => {
      const result = service.generate(mockIdentity, mockCompanyUser);

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
        user: {
          id: mockIdentity.id,
          email: mockIdentity.email,
          company_id: mockCompanyUser.companyId,
          role_id: mockCompanyUser.roleId,
          employee_id: mockCompanyUser.employeeId,
        },
      });
    });

    it('deve incluir dados do usuário na resposta', () => {
      const result = service.generate(mockIdentity, mockCompanyUser);

      expect(result.user).toBeDefined();
      expect(result.user.id).toBe('identity-123');
      expect(result.user.email).toBe('usuario@example.com');
      expect(result.user.company_id).toBe('company-789');
      expect(result.user.role_id).toBe('role-admin');
      expect(result.user.employee_id).toBe('EMP001');
    });

    it('deve incluir employee_id na resposta', () => {
      const result = service.generate(mockIdentity, mockCompanyUser);

      expect(result.user.employee_id).toBe(mockCompanyUser.employeeId);
    });

    it('deve retornar tipo LoginResponseDto', () => {
      const result = service.generate(mockIdentity, mockCompanyUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(typeof result.access_token).toBe('string');
      expect(typeof result.user).toBe('object');
    });

    it('deve chamar jwtService.sign apenas uma vez', () => {
      service.generate(mockIdentity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('deve gerar tokens diferentes para identidades diferentes', () => {
      jwtService.sign
        .mockReturnValueOnce('token.user1')
        .mockReturnValueOnce('token.user2');

      const mockIdentity2 = {
        ...mockIdentity,
        id: 'identity-999',
        email: 'outro@example.com',
      };

      const result1 = service.generate(mockIdentity, mockCompanyUser);
      const result2 = service.generate(
        mockIdentity2 as Identity,
        mockCompanyUser,
      );

      expect(result1.access_token).toBe('token.user1');
      expect(result2.access_token).toBe('token.user2');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('deve usar dados corretos da identidade', () => {
      const customIdentity = {
        ...mockIdentity,
        id: 'custom-id',
        email: 'custom@email.com',
      };

      service.generate(customIdentity as Identity, mockCompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'custom-id',
          identity_id: 'custom-id',
          email: 'custom@email.com',
        }),
      );
    });

    it('deve usar dados corretos do company user', () => {
      const customCompanyUser = {
        ...mockCompanyUser,
        companyId: 'company-custom',
        roleId: 'role-custom',
        employeeId: 'EMP999',
      };

      service.generate(mockIdentity, customCompanyUser as CompanyUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          company_id: 'company-custom',
          role_id: 'role-custom',
        }),
      );
    });
  });
});
