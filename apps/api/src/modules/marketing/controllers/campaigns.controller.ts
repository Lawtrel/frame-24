import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { CampaignsService } from '../services/campaigns.service';

class CreateCampaignDto {
  @ApiProperty({
    description: 'ID do tipo de promoção (ex.: percentual, valor fixo)',
    example: 'PROMO_PERCENT',
  })
  promotion_type_id!: string;

  @ApiProperty({
    description: 'Código único da campanha por empresa',
    example: 'WEEKEND50',
  })
  campaign_code!: string;

  @ApiProperty({
    description: 'Nome público da campanha',
    example: 'Fim de semana 50% OFF',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada apresentada no dashboard',
    example: 'Aplica 50% de desconto em todas as sessões de sábado e domingo.',
  })
  description?: string;

  @ApiProperty({
    description: 'Data/hora inicial de validade (ISO 8601)',
    example: '2025-02-01T00:00:00.000Z',
  })
  start_date!: Date;

  @ApiProperty({
    description: 'Data/hora final da campanha (ISO 8601)',
    example: '2025-03-15T23:59:59.999Z',
  })
  end_date!: Date;
}

@ApiTags('Campaigns')
@ApiBearerAuth()
@Controller({ path: 'campaigns', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @RequirePermission('campaigns', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar campanha promocional',
    description:
      'Cria uma nova campanha promocional para a empresa do usuário autenticado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Campanha criada com sucesso.',
  })
  async create(
    @Body() dto: CreateCampaignDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.campaignsService.create({
      company_id: user.company_id,
      promotion_type_id: dto.promotion_type_id,
      campaign_code: dto.campaign_code,
      name: dto.name,
      description: dto.description,
      start_date: new Date(dto.start_date),
      end_date: new Date(dto.end_date),
    });
  }

  @Get()
  @RequirePermission('campaigns', 'read')
  @ApiOperation({
    summary: 'Listar campanhas',
    description: 'Lista todas as campanhas da empresa do usuário.',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.campaignsService.findAll(user.company_id);
  }

  @Get(':id')
  @RequirePermission('campaigns', 'read')
  @ApiOperation({
    summary: 'Buscar campanha por ID',
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.campaignsService.findOne(user.company_id, id);
  }

  @Post(':id/activate')
  @RequirePermission('campaigns', 'update')
  @ApiOperation({
    summary: 'Ativar campanha',
  })
  async activate(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.campaignsService.activate(user.company_id, id);
  }

  @Post(':id/pause')
  @RequirePermission('campaigns', 'update')
  @ApiOperation({
    summary: 'Pausar campanha',
  })
  async pause(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.campaignsService.pause(user.company_id, id);
  }
}
