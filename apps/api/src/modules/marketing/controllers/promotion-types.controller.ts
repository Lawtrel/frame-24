import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { PromotionTypesService } from '../services/promotion-types.service';
import {
  CreatePromotionTypeDto,
  PromotionTypeResponseDto,
} from '../dto/create-promotion-type.dto';

@ApiTags('Promotion Types')
@ApiBearerAuth()
@Controller({ path: 'promotion-types', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class PromotionTypesController {
  constructor(private readonly promotionTypesService: PromotionTypesService) {}

  @Get()
  @RequirePermission('campaigns', 'read')
  @ApiOperation({
    summary: 'Listar tipos de promoção da empresa',
  })
  @ApiOkResponse({
    description: 'Lista de tipos cadastrados.',
    type: PromotionTypeResponseDto,
    isArray: true,
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.promotionTypesService.findAll(user.company_id);
  }

  @Post()
  @RequirePermission('campaigns', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar tipo de promoção',
    description:
      'Registra um novo tipo de promoção para ser usado nas campanhas.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de promoção criado com sucesso.',
    type: PromotionTypeResponseDto,
  })
  async create(
    @Body() dto: CreatePromotionTypeDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.promotionTypesService.create(user.company_id, dto);
  }
}
