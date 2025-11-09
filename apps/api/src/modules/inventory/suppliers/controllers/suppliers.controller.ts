import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as jwtStrategy from '../../../identity/auth/strategies/jwt.strategy';
import { SuppliersService } from '../services/suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Suppliers')
@Controller({ path: 'suppliers', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @RequirePermission('suppliers', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastro de fornecedor',
    description:
      'Cria um novo fornecedor vinculado à empresa logada. Permite definir tipo, contatos e dados fiscais.',
  })
  @ApiResponse({
    status: 201,
    description: 'Fornecedor criado com sucesso.',
  })
  @ApiConflictResponse({
    description: 'CNPJ já cadastrado para esta empresa.',
  })
  @ApiBadRequestResponse({
    description: 'Erro de validação no payload enviado.',
  })
  async create(
    @Body() dto: CreateSupplierDto,
    @CurrentUser() user: jwtStrategy.RequestUser,
  ) {
    return this.suppliersService.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('suppliers', 'read')
  @ApiOperation({
    summary: 'Listagem de fornecedores',
    description:
      'Retorna todos os fornecedores cadastrados da empresa logada. É possível filtrar apenas distribuidores via query param.',
  })
  @ApiQuery({
    name: 'distributors',
    required: false,
    type: Boolean,
    description: 'Filtra apenas fornecedores marcados como distribuidores',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores retornada com sucesso.',
  })
  async findAll(
    @CurrentUser() user: jwtStrategy.RequestUser,
    @Query('distributors') onlyDistributors?: string,
  ) {
    return this.suppliersService.findAll(
      user.company_id,
      onlyDistributors === 'true',
    );
  }

  @Get('distributors')
  @RequirePermission('suppliers', 'read')
  @ApiOperation({
    summary: 'Listagem de distribuidores de filmes',
    description: 'Retorna somente fornecedores marcados como distribuidores.',
  })
  @ApiResponse({
    status: 200,
    description: 'Distribuidores retornados com sucesso.',
  })
  async findDistributors(@CurrentUser() user: jwtStrategy.RequestUser) {
    return this.suppliersService.findDistributors(user.company_id);
  }

  @Get(':id')
  @RequirePermission('suppliers', 'read')
  @ApiOperation({
    summary: 'Consulta detalhada de fornecedor',
    description: 'Retorna os dados completos de um fornecedor específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do fornecedor',
    example: 'f13df1e8-7c6b-4f12-bc2a-2e68f2e5f2b9',
  })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor encontrado e retornado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fornecedor não encontrado ou não pertence à empresa.',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: jwtStrategy.RequestUser,
  ) {
    return this.suppliersService.findOne(id, user.company_id);
  }

  @Put(':id')
  @RequirePermission('suppliers', 'update')
  @ApiOperation({
    summary: 'Atualização de fornecedor',
    description:
      'Atualiza parcialmente os dados de um fornecedor já cadastrado.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador do fornecedor a ser atualizado',
    example: 'a11df2a1-9b7f-4b33-9c91-7a3a72b1329e',
  })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fornecedor não encontrado.',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
    @CurrentUser() user: jwtStrategy.RequestUser,
  ) {
    return this.suppliersService.update(id, dto, user.company_id);
  }

  @Delete(':id')
  @RequirePermission('suppliers', 'delete')
  @ApiOperation({
    summary: 'Exclusão de fornecedor',
    description:
      'Remove um fornecedor do cadastro. Esta operação é irreversível.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador do fornecedor a ser removido',
  })
  @ApiResponse({
    status: 204,
    description: 'Fornecedor removido com sucesso.',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: jwtStrategy.RequestUser,
  ) {
    return this.suppliersService.delete(id, user.company_id);
  }
}
