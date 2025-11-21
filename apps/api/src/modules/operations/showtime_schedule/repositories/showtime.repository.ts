import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowtimesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.showtime_scheduleCreateInput) {
    return this.prisma.showtime_schedule.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.showtime_schedule.findUnique({
      where: { id },
      select: {
        id: true,
        start_time: true,
        end_time: true,
        base_ticket_price: true,
        available_seats: true,
        sold_seats: true,
        blocked_seats: true,
        movie_id: true,
        room_id: true,
        rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
          },
        },
        cinema_complexes: {
          select: {
            id: true,
            name: true,
            company_id: true,
          },
        },
        projection_types: true,
        audio_types: true,
        session_languages: true,
        session_status: true,
      },
    });
  }

  async findAll(where: Prisma.showtime_scheduleWhereInput) {
    return this.prisma.showtime_schedule.findMany({
      where,
      orderBy: { start_time: 'asc' },
      select: {
        id: true,
        start_time: true,
        end_time: true,
        available_seats: true,
        sold_seats: true,
        blocked_seats: true,
        base_ticket_price: true,
        rooms: { select: { id: true, name: true } },
        projection_types: true,
        audio_types: true,
        session_languages: true,
        session_status: true,
        movie_id: true,
      },
    });
  }

  async update(id: string, data: Prisma.showtime_scheduleUpdateInput) {
    return this.prisma.showtime_schedule.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.showtime_schedule.delete({
      where: { id },
    });
  }

  async findByRoomId(room_id: string) {
    return this.prisma.showtime_schedule.findMany({
      where: { room_id },
      orderBy: { start_time: 'asc' }, // NOVO
    });
  }

  async findOverlappingSessions(
    room_id: string,
    start_time: Date,
    end_time: Date,
    showtimeToExcludeId?: string,
  ) {
    const where: Prisma.showtime_scheduleWhereInput = {
      room_id,
      start_time: { lt: end_time },
      end_time: { gt: start_time },
    };

    if (showtimeToExcludeId) {
      where.id = { not: showtimeToExcludeId };
    }

    return this.prisma.showtime_schedule.findMany({ where });
  }

  async findByMovieId(movie_id: string) {
    return this.prisma.showtime_schedule.findMany({
      where: { movie_id },
      orderBy: { start_time: 'asc' }, // NOVO
    });
  }
}
