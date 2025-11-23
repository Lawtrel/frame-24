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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { FederalTaxRatesService } from '../services/federal-tax-rates.service';
import { CreateFederalTaxRateDto } from '../dto/create-federal-tax-rate.dto';
import { UpdateFederalTaxRateDto } from '../dto/update-federal-tax-rate.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller({ path: 'tax/federal', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class FederalTaxRatesController {
  constructor(private readonly service: FederalTaxRatesService) {}

  @Post()
  @RequirePermission('tax', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar taxa federal (PIS/COFINS/IRPJ/CSLL)' })
  async create(
    @Body() dto: CreateFederalTaxRateDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Listar taxas federais cadastradas' })
  async list(@CurrentUser() user: RequestUser) {
    return this.service.list(user.company_id);
  }

  @Get(':id')
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Buscar taxa federal por ID' })
  @ApiParam({ name: 'id', description: 'Identificador da taxa federal' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findById(user.company_id, id);
  }

  @Put(':id')
  @RequirePermission('tax', 'update')
  @ApiOperation({ summary: 'Atualizar taxa federal' })
  @ApiParam({ name: 'id', description: 'Identificador da taxa federal' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFederalTaxRateDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(user.company_id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('tax', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir taxa federal' })
  @ApiParam({ name: 'id', description: 'Identificador da taxa federal' })
  @ApiResponse({ status: 204, description: 'Taxa removida.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.service.delete(user.company_id, id);
  }
}
