import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SalesService } from 'src/modules/sales/services/sales.service';
import { CreateSaleDto } from 'src/modules/sales/dto/create-sale.dto';
import { SaleResponseDto } from 'src/modules/sales/dto/sale-response.dto';
import { CinemaComplexesRepository } from 'src/modules/operations/cinema-complexes/repositories/cinema-complexes.repository';

@ApiTags('Public Sales')
@Controller({ path: 'public/sales', version: '1' })
export class PublicSalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly cinemaComplexesRepository: CinemaComplexesRepository,
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova venda (Público)' })
  @ApiResponse({
    status: 201,
    description: 'Venda criada com sucesso',
    type: SaleResponseDto,
  })
  async create(@Body() dto: CreateSaleDto): Promise<SaleResponseDto> {
    // Buscar o complexo para obter o companyId
    const complex = await this.cinemaComplexesRepository.findById(
      dto.cinema_complex_id,
    );

    if (!complex) {
      throw new NotFoundException('Complexo de cinema não encontrado');
    }

    return this.salesService.create(dto, {
      companyId: complex.company_id,
      customerId: dto.customer_id,
      sessionContext: 'CUSTOMER',
    });
  }
}
