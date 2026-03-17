import { ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import { CreateMovieCategoryDto } from '../dto/create-movie-category.dto';
import { MovieCategoryRepository } from '../repositories/movie-category.repository';
import { MovieCategoriesService } from './movie-categories.service';

describe('MovieCategoriesService', () => {
  const repository = {
    uniqueSlugForName: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<MovieCategoryRepository>;

  const rabbitmq = {
    publish: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<RabbitMQPublisherService>;

  const cls = {
    get: jest.fn(),
  } as unknown as jest.Mocked<ClsService>;

  const service = new MovieCategoriesService(repository, rabbitmq, cls);

  beforeEach(() => {
    jest.clearAllMocks();
    cls.get.mockImplementation((key?: string | symbol) => {
      if (key === 'companyId') return 'company-123';
      if (key === 'userId') return 'user-123';
      return undefined;
    });
  });

  it('deve criar categoria usando company_id e userId do contexto', async () => {
    const dto = { name: 'Ação' } as CreateMovieCategoryDto;
    repository.uniqueSlugForName.mockResolvedValue('acao');
    repository.create.mockResolvedValue({ id: 'cat-1', name: 'Ação' } as any);

    await service.create(dto);

    expect(repository.uniqueSlugForName).toHaveBeenCalledWith(
      'Ação',
      'company-123',
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        company_id: 'company-123',
        slug: 'acao',
      }),
    );
    expect(rabbitmq.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          companyId: 'company-123',
          userId: 'user-123',
        },
      }),
    );
  });

  it('deve listar categorias da empresa do contexto', async () => {
    repository.findAll.mockResolvedValue([{ id: 'cat-1' }] as any);

    const result = await service.findAll();

    expect(repository.findAll).toHaveBeenCalledWith('company-123');
    expect(result).toEqual([{ id: 'cat-1' }]);
  });

  it('deve lançar erro quando company_id não existe no contexto', async () => {
    cls.get.mockReturnValue(undefined);

    await expect(service.findAll()).rejects.toBeInstanceOf(ForbiddenException);
  });
});
