import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CompanyUserLinkerService } from './company-user-linker.service';
import { CompanyUserRepository } from '../repositories/company-user.repository';
import { CustomRoleRepository } from '../repositories/custom-role.repository';
import { CompanyUser } from '../domain/entities/company-user.entity';
import { EmployeeIdGeneratorService } from 'src/modules/identity/auth/services/employee-id-generator';

describe('CompanyUserLinkerService', () => {
  let service: CompanyUserLinkerService;
  let companyUserRepository: jest.Mocked<CompanyUserRepository>;
  let customRoleRepository: jest.Mocked<CustomRoleRepository>;
  let employeeIdGenerator: jest.Mocked<EmployeeIdGeneratorService>;

  const mockCompanyUser: CompanyUser = {
    id: 'company-user-123',
    identityId: 'identity-456',
    companyId: 'company-789',
    roleId: 'role-111',
    employeeId: 'CIN-0001',
  } as CompanyUser;

  const mockDefaultRole = {
    id: 'role-default',
    name: 'Operador',
    is_system_role: true,
  };

  const mockAdminRole = {
    id: 'role-admin',
    name: 'Super Admin',
    is_system_role: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyUserLinkerService,
        {
          provide: CompanyUserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CustomRoleRepository,
          useValue: {
            findDefaultRole: jest.fn(),
            createAdminRole: jest.fn(),
          },
        },
        {
          provide: EmployeeIdGeneratorService,
          useValue: {
            generate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyUserLinkerService>(CompanyUserLinkerService);
    companyUserRepository = module.get(CompanyUserRepository);
    customRoleRepository = module.get(CustomRoleRepository);
    employeeIdGenerator = module.get(EmployeeIdGeneratorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('linkToCompany', () => {
    const identityId = 'identity-456';
    const companyId = 'company-789';

    beforeEach(() => {
      employeeIdGenerator.generate.mockResolvedValue('CIN-0001');
      companyUserRepository.create.mockResolvedValue(mockCompanyUser);
    });

    it('deve vincular usuário à empresa com roleId fornecido', async () => {
      const roleId = 'role-custom';

      const result = await service.linkToCompany(identityId, companyId, roleId);

      expect(result).toEqual(mockCompanyUser);
      expect(employeeIdGenerator.generate).toHaveBeenCalledWith(companyId);
      expect(companyUserRepository.create).toHaveBeenCalledWith(
        identityId,
        companyId,
        roleId,
        'CIN-0001',
      );
    });

    it('deve gerar employee_id antes de criar company_user', async () => {
      await service.linkToCompany(identityId, companyId, 'role-123');

      expect(employeeIdGenerator.generate).toHaveBeenCalledWith(companyId);
    });

    it('deve usar role padrão quando roleId não for fornecido', async () => {
      customRoleRepository.findDefaultRole.mockResolvedValue(
        mockDefaultRole as any,
      );

      const result = await service.linkToCompany(identityId, companyId);

      expect(customRoleRepository.findDefaultRole).toHaveBeenCalledWith(
        companyId,
      );
      expect(companyUserRepository.create).toHaveBeenCalledWith(
        identityId,
        companyId,
        'role-default',
        'CIN-0001',
      );
      expect(result).toEqual(mockCompanyUser);
    });

    it('deve lançar NotFoundException quando role padrão não existir', async () => {
      customRoleRepository.findDefaultRole.mockResolvedValue(null);

      await expect(
        service.linkToCompany(identityId, companyId),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.linkToCompany(identityId, companyId),
      ).rejects.toThrow('Role padrão não encontrada');
    });

    it('não deve buscar role padrão se roleId for fornecido', async () => {
      await service.linkToCompany(identityId, companyId, 'role-custom');

      expect(customRoleRepository.findDefaultRole).not.toHaveBeenCalled();
    });

    it('deve passar todos os parâmetros corretos para create', async () => {
      customRoleRepository.findDefaultRole.mockResolvedValue(
        mockDefaultRole as any,
      );

      await service.linkToCompany(identityId, companyId);

      expect(companyUserRepository.create).toHaveBeenCalledWith(
        'identity-456',
        'company-789',
        'role-default',
        'CIN-0001',
      );
    });

    it('deve retornar o CompanyUser criado', async () => {
      const result = await service.linkToCompany(
        identityId,
        companyId,
        'role-123',
      );

      expect(result).toBe(mockCompanyUser);
      expect(result.id).toBe('company-user-123');
      expect(result.employeeId).toBe('CIN-0001');
    });
  });

  describe('createAdminUser', () => {
    const identityId = 'identity-456';
    const companyId = 'company-789';

    beforeEach(() => {
      customRoleRepository.createAdminRole.mockResolvedValue(
        mockAdminRole as any,
      );
      employeeIdGenerator.generate.mockResolvedValue('CIN-0001');
      companyUserRepository.create.mockResolvedValue(mockCompanyUser);
    });

    it('deve criar role de admin e vincular usuário', async () => {
      const result = await service.createAdminUser(identityId, companyId);

      expect(customRoleRepository.createAdminRole).toHaveBeenCalledWith(
        companyId,
      );
      expect(result).toEqual(mockCompanyUser);
    });

    it('deve usar o ID da role admin criada para vincular usuário', async () => {
      await service.createAdminUser(identityId, companyId);

      expect(companyUserRepository.create).toHaveBeenCalledWith(
        identityId,
        companyId,
        'role-admin',
        'CIN-0001',
      );
    });

    it('deve chamar linkToCompany internamente', async () => {
      const linkSpy = jest.spyOn(service, 'linkToCompany');

      await service.createAdminUser(identityId, companyId);

      expect(linkSpy).toHaveBeenCalledWith(identityId, companyId, 'role-admin');
    });

    it('deve gerar employee_id para o admin', async () => {
      await service.createAdminUser(identityId, companyId);

      expect(employeeIdGenerator.generate).toHaveBeenCalledWith(companyId);
    });

    it('deve retornar o CompanyUser criado', async () => {
      const result = await service.createAdminUser(identityId, companyId);

      expect(result).toBe(mockCompanyUser);
      expect(result.id).toBe('company-user-123');
    });
  });
});
