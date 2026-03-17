import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { cinema_complexes as CinemaComplex } from '@repo/db';

import { CinemaComplexesRepository } from '../repositories/cinema-complexes.repository';
import { CreateCinemaComplexDto } from '../dto/create-cinema-complex.dto';
import { UpdateCinemaComplexDto } from '../dto/update-cinema-complex.dto';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class CinemaComplexesService {
  constructor(
    private readonly repository: CinemaComplexesRepository,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Transactional()
  async create(
    dto: CreateCinemaComplexDto,
    companyId: string,
    companyUserId: string,
  ): Promise<CinemaComplex> {
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
        userId: companyUserId,
      },
    });

    return createdComplex;
  }

  async findAll(company_id: string): Promise<CinemaComplex[]> {
    return this.repository.findAllByCompany(company_id);
  }

  async findOne(id: string, company_id: string): Promise<CinemaComplex> {
    const complex = await this.repository.findById(id);

    if (!complex || complex.company_id !== company_id) {
      throw new NotFoundException('Complexo de cinema não encontrado.');
    }
    return complex;
  }

  @Transactional()
  async update(
    id: string,
    dto: UpdateCinemaComplexDto,
    companyId: string,
    companyUserId: string,
  ): Promise<CinemaComplex> {
    const existingComplex = await this.findOne(id, companyId);

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
        userId: companyUserId,
      },
    });

    return updatedComplex;
  }

  async delete(
    id: string,
    companyId: string,
    companyUserId: string,
  ): Promise<{ message: string }> {
    const existingComplex = await this.findOne(id, companyId);

    await this.repository.remove(id);

    void this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.deleted',
      data: {
        id: existingComplex.id,
        old_values: existingComplex,
      },
      metadata: {
        companyId,
        userId: companyUserId,
      },
    });

    return { message: 'Complexo de cinema deletado com sucesso.' };
  }
}
