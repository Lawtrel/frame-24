import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PublicService } from '../services/public.service';

@ApiTags('Public')
@Controller({ path: 'public', version: '1' })
export class PublicController {
  constructor(private readonly publicService: PublicService) { }

  @Get('companies')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar empresas públicas',
    description:
      'Retorna lista de todas as empresas ativas disponíveis para compra de ingressos',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico de compras retornado com sucesso',
  })
  async getCompanies() {
    return this.publicService.getCompanies();
  }

  @Get('companies/:tenant_slug')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar empresa por tenant slug',
    description: 'Retorna informações públicas de uma empresa específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada',
  })
  async getCompanyBySlug(@Param('tenant_slug') tenant_slug: string) {
    return this.publicService.getCompanyBySlug(tenant_slug);
  }

  @Get('companies/:tenant_slug/complexes')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar complexos de cinema de uma empresa',
    description: 'Retorna todos os complexos ativos de uma empresa específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de complexos retornada com sucesso',
  })
  async getComplexes(@Param('tenant_slug') tenant_slug: string) {
    const company = await this.publicService.getCompanyBySlug(tenant_slug);
    return this.publicService.getComplexesByCompany(company.id);
  }

  @Get('companies/:tenant_slug/movies')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar filmes em exibição',
    description: 'Retorna todos os filmes ativos em exibição de uma empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de filmes retornada com sucesso',
  })
  async getMovies(@Param('tenant_slug') tenant_slug: string) {
    const company = await this.publicService.getCompanyBySlug(tenant_slug);
    return this.publicService.getMoviesByCompany(company.id);
  }

  @Get('companies/:tenant_slug/showtimes')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar sessões disponíveis',
    description:
      'Retorna sessões disponíveis de uma empresa, com filtros opcionais',
  })
  @ApiQuery({
    name: 'complex_id',
    required: false,
    description: 'ID do complexo',
  })
  @ApiQuery({ name: 'movie_id', required: false, description: 'ID do filme' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Data das sessões (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sessões retornada com sucesso',
  })
  async getShowtimes(
    @Param('tenant_slug') tenant_slug: string,
    @Query('complex_id') complex_id?: string,
    @Query('movie_id') movie_id?: string,
    @Query('date') date?: string,
  ) {
    const company = await this.publicService.getCompanyBySlug(tenant_slug);
    return this.publicService.getShowtimesByCompany(company.id, {
      complex_id,
      movie_id,
      date: date ? new Date(date) : undefined,
    });
  }

  @Get('showtimes/:id/seats')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter mapa de assentos de uma sessão',
    description:
      'Retorna o mapa completo de assentos com status (disponível, reservado, vendido)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mapa de assentos retornado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Sessão não encontrada',
  })
  async getSeatsMap(@Param('id') id: string) {
    return this.publicService.getShowtimeSeatsMap(id);
  }

  @Get('companies/:tenant_slug/products')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar produtos de concessão',
    description: 'Retorna produtos de concessão disponíveis para venda',
  })
  @ApiQuery({
    name: 'complex_id',
    required: false,
    description: 'ID do complexo para preços específicos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
  })
  async getProducts(
    @Param('tenant_slug') tenant_slug: string,
    @Query('complex_id') complex_id?: string,
  ) {
    const company = await this.publicService.getCompanyBySlug(tenant_slug);
    return this.publicService.getProductsByCompany(company.id, complex_id);
  }

  @Get('companies/:tenant_slug/ticket-types')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar tipos de ingresso',
    description: 'Retorna os tipos de ingresso disponíveis para uma empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de ingresso retornada com sucesso',
  })
  async getTicketTypes(@Param('tenant_slug') tenant_slug: string) {
    const company = await this.publicService.getCompanyBySlug(tenant_slug);
    return this.publicService.getTicketTypes(company.id);
  }

  @Get('companies/:tenant_slug/payment-methods')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar métodos de pagamento',
    description: 'Retorna os métodos de pagamento ativos para uma empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de métodos de pagamento retornada com sucesso',
  })
  async getPaymentMethods(@Param('tenant_slug') tenant_slug: string) {
    const company = await this.publicService.getCompanyBySlug(tenant_slug);
    return this.publicService.getPaymentMethods(company.id);
  }

  @Get('sales/:id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter detalhes da venda',
    description:
      'Retorna os detalhes completos de uma venda (ingressos, produtos, sessão)',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da venda retornados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Venda não encontrada',
  })
  async getSaleDetails(@Param('id') id: string) {
    return this.publicService.getSaleDetails(id);
  }

  @Get('movies/:id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter detalhes do filme',
    description: 'Retorna os detalhes completos de um filme',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do filme retornados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Filme não encontrado',
  })
  async getMovie(@Param('id') id: string) {
    return this.publicService.getMovie(id);
  }


}
