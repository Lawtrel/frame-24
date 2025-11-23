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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { MunicipalTaxParametersService } from '../services/municipal-tax-parameters.service';
import { CreateMunicipalTaxParameterDto } from '../dto/create-municipal-tax-parameter.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { UpdateMunicipalTaxParameterDto } from '../dto/update-municipal-tax-parameter.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller({ path: 'tax/municipal', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class MunicipalTaxParametersController {
  constructor(private readonly service: MunicipalTaxParametersService) {}

  @Post()
  @RequirePermission('tax', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar parâmetro municipal de ISS' })
  async create(
    @Body() dto: CreateMunicipalTaxParameterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Listar parâmetros municipais da empresa' })
  async list(@CurrentUser() user: RequestUser) {
    return this.service.listByCompany(user.company_id);
  }

  @Get(':id')
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Buscar parâmetro municipal por ID' })
  @ApiParam({ name: 'id', description: 'Identificador do parâmetro' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findById(user.company_id, id);
  }

  @Put(':id')
  @RequirePermission('tax', 'update')
  @ApiOperation({ summary: 'Atualizar parâmetro municipal' })
  @ApiParam({ name: 'id', description: 'Identificador do parâmetro' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMunicipalTaxParameterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(user.company_id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('tax', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir parâmetro municipal' })
  @ApiParam({ name: 'id', description: 'Identificador do parâmetro' })
  @ApiResponse({ status: 204, description: 'Parâmetro removido.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.service.delete(user.company_id, id);
  }
}
