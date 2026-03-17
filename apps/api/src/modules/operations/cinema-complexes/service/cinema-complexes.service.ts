import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { cinema_complexes as CinemaComplex } from '@repo/db';

import { CinemaComplexesRepository } from '../repositories/cinema-complexes.repository';
import { CreateCinemaComplexDto } from '../dto/create-cinema-complex.dto';
import { UpdateCinemaComplexDto } from '../dto/update-cinema-complex.dto';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import { Transactional } from '@nestjs-cls/transactional';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class CinemaComplexesService {
  constructor(
    private readonly repository: CinemaComplexesRepository,
    private readonly rabbitmq: RabbitMQPublisherService,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto de empresa não encontrado.');
    }
    return companyId;
  }

  private getUserId(): string | undefined {
    return this.cls.get<string>('userId');
  }

  @Transactional()
  async create(dto: CreateCinemaComplexDto): Promise<CinemaComplex> {
    const companyId = this.getCompanyId();
    const userId = this.getUserId();

    const existingByCode = await this.repository.findByCode(
      dto.code,
      companyId,
    );
    if (existingByCode) {
      throw new ConflictException(
        `O código '${dto.code}' já está em uso nesta empresa.`,
      );
    }

    const dataToCreate: CreateCinemaComplexDto & { company_id: string } = {
      ...dto,
      company_id: companyId,
    };

    const createdComplex = await this.repository.create(dataToCreate);

    void this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.created',
      data: {
        id: createdComplex.id,
        new_values: createdComplex,
      },
      metadata: {
        companyId,
        userId,
      },
    });

    return createdComplex;
  }

  async findAll(): Promise<CinemaComplex[]> {
    return this.repository.findAllByCompany(this.getCompanyId());
  }

  async findOne(id: string): Promise<CinemaComplex> {
    const companyId = this.getCompanyId();
    const complex = await this.repository.findById(id);

    if (!complex || complex.company_id !== companyId) {
      throw new NotFoundException('Complexo de cinema não encontrado.');
    }
    return complex;
  }

  @Transactional()
  async update(id: string, dto: UpdateCinemaComplexDto): Promise<CinemaComplex> {
    const companyId = this.getCompanyId();
    const userId = this.getUserId();
    const existingComplex = await this.findOne(id);

    if (dto.code && dto.code !== existingComplex.code) {
      const existingByCode = await this.repository.findByCode(
        dto.code,
        companyId,
      );
      if (existingByCode) {
        throw new ConflictException(
          `O código '${dto.code}' já está em uso nesta empresa.`,
        );
      }
    }

    const updatedComplex = await this.repository.update(id, dto);

    void this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.updated',
      data: {
        id: updatedComplex.id,
        new_values: updatedComplex,
        old_values: existingComplex,
      },
      metadata: {
        companyId,
        userId,
      },
    });

    return updatedComplex;
  }

  async delete(id: string): Promise<{ message: string }> {
    const companyId = this.getCompanyId();
    const userId = this.getUserId();
    const existingComplex = await this.findOne(id);

    await this.repository.remove(id);

    void this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.deleted',
      data: {
        id: existingComplex.id,
        old_values: existingComplex,
      },
      metadata: {
        companyId,
        userId,
      },
    });

    return { message: 'Complexo de cinema deletado com sucesso.' };
  }
}
