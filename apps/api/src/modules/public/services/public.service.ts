import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CinemaComplexesRepository } from 'src/modules/operations/cinema-complexes/repositories/cinema-complexes.repository';
import { ShowtimesRepository } from 'src/modules/operations/showtime_schedule/repositories/showtime.repository';
import { MovieRepository } from 'src/modules/catalog/movies/repositories/movie.repository';
import { ProductRepository } from 'src/modules/catalog/products/repositories/product.repository';
import { SeatsRepository } from 'src/modules/operations/seats/repositories/seats.repository';
import { SessionSeatStatusRepository } from 'src/modules/operations/session_seat_status/repositories/session-seat-status.repository';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cinemaComplexesRepository: CinemaComplexesRepository,
    private readonly showtimesRepository: ShowtimesRepository,
    private readonly moviesRepository: MovieRepository,
    private readonly productsRepository: ProductRepository,
    private readonly seatsRepository: SeatsRepository,
    private readonly sessionSeatStatusRepository: SessionSeatStatusRepository,
  ) {}

  async getCompanies() {
    return this.prisma.companies.findMany({
      where: {
        active: true,
        suspended: false,
      },
      select: {
        id: true,
        corporate_name: true,
        trade_name: true,
        tenant_slug: true,
        logo_url: true,
        city: true,
        state: true,
      },
      orderBy: {
        corporate_name: 'asc',
      },
    });
  }

  async getCompanyBySlug(tenant_slug: string): Promise<{
    id: string;
    corporate_name: string;
    trade_name: string | null;
    tenant_slug: string;
    logo_url: string | null;
    city: string | null;
    state: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
  }> {
    const company = await this.prisma.companies.findUnique({
      where: { tenant_slug },
    });

    if (!company || !company.active || company.suspended) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return {
      id: company.id,
      corporate_name: company.corporate_name,
      trade_name: company.trade_name,
      tenant_slug: company.tenant_slug,
      logo_url: company.logo_url,
      city: company.city,
      state: company.state,
      phone: company.phone,
      email: company.email,
      website: company.website,
    };
  }

  async getComplexesByCompany(company_id: string) {
    const complexes =
      await this.cinemaComplexesRepository.findAllByCompany(company_id);
    return complexes.filter((c) => c.active === true);
  }

  async getMoviesByCompany(company_id: string) {
    return this.moviesRepository.findByCompany(company_id);
  }

  async getShowtimesByCompany(
    company_id: string,
    filters?: {
      complex_id?: string;
      movie_id?: string;
      date?: Date;
    },
  ) {
    // Buscar complexos da empresa
    const complexes =
      await this.cinemaComplexesRepository.findAllByCompany(company_id);
    const complexIds = complexes.map((c) => c.id);

    // Filtrar por complexo se fornecido
    const targetComplexIds = filters?.complex_id
      ? [filters.complex_id]
      : complexIds;

    // Buscar sessões
    const where: any = {
      cinema_complex_id: { in: targetComplexIds },
      ...(filters?.movie_id && { movie_id: filters.movie_id }),
    };

    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.start_time = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const showtimes = await this.prisma.showtime_schedule.findMany({
      where,
      select: {
        id: true,
        movie_id: true,
        start_time: true,
        end_time: true,
        base_ticket_price: true,
        available_seats: true,
        sold_seats: true,
        blocked_seats: true,
        cinema_complexes: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        rooms: {
          select: {
            id: true,
            name: true,
            room_number: true,
          },
        },
        projection_types: {
          select: {
            id: true,
            name: true,
          },
        },
        audio_types: {
          select: {
            id: true,
            name: true,
          },
        },
        session_languages: {
          select: {
            id: true,
            name: true,
          },
        },
        session_status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    // Filtrar apenas sessões futuras ou do dia atual e buscar filmes
    const now = new Date();
    const filteredShowtimes = showtimes.filter(
      (s) => new Date(s.start_time) >= now,
    );

    // Buscar filmes para cada sessão com includes
    const movieIds = [...new Set(filteredShowtimes.map((s) => s.movie_id))];
    const movies = await this.prisma.movies.findMany({
      where: { id: { in: movieIds } },
      include: {
        age_rating: {
          select: {
            code: true,
            name: true,
          },
        },
        movie_media: {
          where: {
            media_type: 'POSTER',
            active: true,
          },
          take: 1,
          select: {
            media_url: true,
          },
        },
      },
    });
    const movieMap = new Map(movies.map((m) => [m.id, m]));

    // Adicionar dados do filme a cada sessão
    return filteredShowtimes.map((showtime) => {
      const movie = movieMap.get(showtime.movie_id);
      return {
        ...showtime,
        movie: movie
          ? {
              id: movie.id,
              title: movie.brazil_title || movie.original_title,
              poster_url: movie.movie_media[0]?.media_url || null,
              duration_minutes: movie.duration_minutes,
              age_rating: movie.age_rating?.code || null,
            }
          : null,
      };
    });
  }

  async getShowtimeSeatsMap(showtime_id: string) {
    const showtime = await this.showtimesRepository.findById(showtime_id);
    if (!showtime || !('room_id' in showtime) || !showtime.room_id) {
      throw new NotFoundException('Sessão não encontrada');
    }

    // Buscar todos os assentos da sala
    const seats = await this.seatsRepository.findByRoomId(showtime.room_id);

    // Buscar status dos assentos para esta sessão
    const seatStatuses =
      await this.sessionSeatStatusRepository.findByShowtimeId(showtime_id);

    // Mapear status dos assentos
    const seatMap = new Map<string, any>();
    seatStatuses.forEach((ss) => {
      seatMap.set(ss.seat_id, {
        status: ss.status,
        sale_id: ss.sale_id,
        reservation_uuid: ss.reservation_uuid,
        expiration_date: ss.expiration_date,
      });
    });

    // Montar mapa de assentos
    const seatsMap = seats.map((seat) => {
      const status = seatMap.get(seat.id);
      return {
        id: seat.id,
        seat_code: seat.seat_code,
        row_code: seat.row_code,
        column_number: seat.column_number,
        accessible: seat.accessible,
        status: status?.status || 'available',
        reserved: !!status?.reservation_uuid,
        reserved_until: status?.expiration_date || null,
      };
    });

    return {
      showtime_id,
      room_id: showtime.room_id,
      available_seats: showtime.available_seats || 0,
      sold_seats: showtime.sold_seats || 0,
      seats: seatsMap,
    };
  }

  async getProductsByCompany(company_id: string, complex_id?: string) {
    const products = await this.productsRepository.findAll(company_id, true);

    // Se complex_id fornecido, buscar preços específicos
    if (complex_id) {
      const productsWithPrices = await Promise.all(
        products.map(async (product) => {
          const price = await this.prisma.product_prices.findFirst({
            where: {
              product_id: product.id,
              complex_id: complex_id,
              active: true,
              valid_from: { lte: new Date() },
              OR: [{ valid_to: { gte: new Date() } }, { valid_to: null }],
            },
            orderBy: { created_at: 'desc' },
          });

          return {
            ...product,
            price: price ? Number(price.sale_price) : null,
          };
        }),
      );

      return productsWithPrices.filter((p) => p.price !== null);
    }

    return products;
  }
}
