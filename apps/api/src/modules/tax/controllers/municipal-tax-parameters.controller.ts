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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { MunicipalTaxParametersService } from '../services/municipal-tax-parameters.service';
import { CreateMunicipalTaxParameterDto } from '../dto/create-municipal-tax-parameter.dto';
import { UpdateMunicipalTaxParameterDto } from '../dto/update-municipal-tax-parameter.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller({ path: 'tax/municipal', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class MunicipalTaxParametersController {
  constructor(private readonly service: MunicipalTaxParametersService) {}

  @Post()
  @RequirePermission('tax', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar parâmetro municipal de ISS' })
  async create(@Body() dto: CreateMunicipalTaxParameterDto) {
    return this.service.create(dto);
  }

  @Get()
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Listar parâmetros municipais da empresa' })
  async list() {
    return this.service.listByCompany();
  }

  @Get(':id')
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Buscar parâmetro municipal por ID' })
  @ApiParam({ name: 'id', description: 'Identificador do parâmetro' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @RequirePermission('tax', 'update')
  @ApiOperation({ summary: 'Atualizar parâmetro municipal' })
  @ApiParam({ name: 'id', description: 'Identificador do parâmetro' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMunicipalTaxParameterDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('tax', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir parâmetro municipal' })
  @ApiParam({ name: 'id', description: 'Identificador do parâmetro' })
  @ApiResponse({ status: 204, description: 'Parâmetro removido.' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
