import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { LoggerService } from 'src/common/services/logger.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierRepository } from '../repositories/supplier.repository';
import { SuppliersService } from './suppliers.service';

describe('SuppliersService', () => {
  const repository = {
    create: jest.fn(),
    findByCnpj: jest.fn(),
    findByCompany: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    findDistributors: jest.fn(),
    findTypes: jest.fn(),
  } as unknown as jest.Mocked<SupplierRepository>;

  const logger = {
    log: jest.fn(),
  } as unknown as jest.Mocked<LoggerService>;

  const cls = {
    get: jest.fn(),
  } as unknown as jest.Mocked<ClsService>;

  const service = new SuppliersService(repository, logger, cls);

  beforeEach(() => {
    jest.clearAllMocks();
    cls.get.mockImplementation((key?: string | symbol) => {
      if (key === 'companyId') return 'company-123';
      return undefined;
    });
  });

  it('deve criar fornecedor usando company_id do contexto', async () => {
    const dto = {
      corporate_name: 'Paris Filmes LTDA',
      cnpj: '12.345.678/0001-90',
      phone: '(11)3334-5566',
    } as CreateSupplierDto;

    repository.findByCnpj.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 'sup-1' } as any);

    await service.create(dto);

    expect(repository.findByCnpj).toHaveBeenCalledWith(
      '12345678000190',
      'company-123',
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        company_id: 'company-123',
        cnpj: '12345678000190',
        phone: '1133345566',
      }),
    );
  });

  it('deve listar fornecedores da empresa do contexto', async () => {
    repository.findByCompany.mockResolvedValue([{ id: 'sup-1' }] as any);

    const result = await service.findAll(true);

    expect(repository.findByCompany).toHaveBeenCalledWith('company-123', true);
    expect(result).toEqual([{ id: 'sup-1' }]);
  });

  it('deve lançar not found para fornecedor de outra empresa', async () => {
    repository.findById.mockResolvedValue({
      id: 'sup-1',
      company_id: 'company-999',
    } as any);

    await expect(service.findOne('sup-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deve lançar erro quando company_id não existe no contexto', async () => {
    cls.get.mockReturnValue(undefined);

    await expect(service.findAll()).rejects.toBeInstanceOf(ForbiddenException);
  });
});
