import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { JournalEntriesService } from '../services/journal-entries.service';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';

@ApiTags('Lançamentos Contábeis')
@ApiBearerAuth()
@Controller({ path: 'finance/journal-entries', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class JournalEntriesController {
  constructor(private readonly journalEntries: JournalEntriesService) { }

  @Post()
  @RequirePermission('finance_entries', 'create')
  @ApiOperation({ summary: 'Criar lançamento contábil' })
  async create(
    @Body() dto: CreateJournalEntryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.journalEntries.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('finance_entries', 'read')
  @ApiOperation({ summary: 'Listar lançamentos contábeis' })
  @ApiQuery({
    name: 'cinema_complex_id',
    required: false,
    description: 'Filtrar por complexo',
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    description: 'Data final (YYYY-MM-DD)',
  })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('cinema_complex_id') cinema_complex_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.journalEntries.findAll(user.company_id, {
      cinema_complex_id,
      start_date,
      end_date,
    });
  }
}
