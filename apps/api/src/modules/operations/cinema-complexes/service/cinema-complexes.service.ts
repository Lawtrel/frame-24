import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { cinema_complexes as CinemaComplex } from '@repo/db';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

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
    user: RequestUser,
  ): Promise<CinemaComplex> {
    const companyId = user.company_id;

    const existingByCode = await this.repository.findByCode(
      dto.code,
      companyId,
    );
    if (existingByCode) {
      throw new ConflictException(
        `O código '${dto.code}' já está em uso nesta empresa.`,
      );
    }

    const dataToCreate: CreateCinemaComplexDto = {
      ...dto,
      company_id: companyId,
    };

    const createdComplex = await this.repository.create(dataToCreate);

    this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.created',
      data: {
        id: createdComplex.id,
        new_values: createdComplex,
      },
      metadata: {
        companyId: companyId,
        userId: user.company_user_id,
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
    user: RequestUser,
  ): Promise<CinemaComplex> {
    const companyId = user.company_id;
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

    this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.updated',
      data: {
        id: updatedComplex.id,
        new_values: updatedComplex,
        old_values: existingComplex,
      },
      metadata: {
        companyId: companyId,
        userId: user.company_user_id,
      },
    });

    return updatedComplex;
  }

  async delete(id: string, user: RequestUser): Promise<{ message: string }> {
    const companyId = user.company_id;
    const existingComplex = await this.findOne(id, companyId);

    await this.repository.remove(id);

    this.rabbitmq.publish({
      pattern: 'audit.cinema_complex.deleted',
      data: {
        id: existingComplex.id,
        old_values: existingComplex,
      },
      metadata: {
        companyId: companyId,
        userId: user.company_user_id,
      },
    });

    return { message: 'Complexo de cinema deletado com sucesso.' };
  }
}
