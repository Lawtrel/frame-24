import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { ExhibitionContractsService } from '../services/exhibition-contracts.service';
import { CreateExhibitionContractDto } from '../dto/create-exhibition-contract.dto';
import { UpdateExhibitionContractDto } from '../dto/update-exhibition-contract.dto';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller({ path: 'contracts/exhibition', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ExhibitionContractsController {
  constructor(private readonly service: ExhibitionContractsService) {}

  @Post()
  @RequirePermission('contracts', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar contrato de exibição' })
  async create(
    @Body() dto: CreateExhibitionContractDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('contracts', 'read')
  @ApiOperation({ summary: 'Listar contratos de exibição' })
  @ApiQuery({ name: 'movie_id', required: false })
  @ApiQuery({ name: 'cinema_complex_id', required: false })
  @ApiQuery({ name: 'distributor_id', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async list(
    @CurrentUser() user: RequestUser,
    @Query('movie_id') movie_id?: string,
    @Query('cinema_complex_id') cinema_complex_id?: string,
    @Query('distributor_id') distributor_id?: string,
    @Query('active') active?: string,
  ) {
    const filters = {
      movie_id,
      cinema_complex_id,
      distributor_id,
      active: active === undefined ? undefined : active === 'true',
    };

    return this.service.findAll(user.company_id, filters);
  }

  @Get(':id')
  @RequirePermission('contracts', 'read')
  @ApiOperation({ summary: 'Buscar contrato de exibição por ID' })
  @ApiParam({ name: 'id', description: 'Identificador do contrato' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findOne(user.company_id, id);
  }

  @Put(':id')
  @RequirePermission('contracts', 'update')
  @ApiOperation({ summary: 'Atualizar contrato de exibição' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExhibitionContractDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(user.company_id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('contracts', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativar contrato de exibição' })
  @ApiResponse({ status: 204, description: 'Contrato desativado.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.service.delete(user.company_id, id);
  }
}
