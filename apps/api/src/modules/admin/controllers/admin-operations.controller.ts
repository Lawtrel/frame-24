import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { AdminOperationsService } from '../services/admin-operations.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller({ path: 'admin', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AdminOperationsController {
  constructor(private readonly adminService: AdminOperationsService) {}

  @Get('reservations')
  @RequirePermission('showtimes', 'read')
  @ApiOperation({
    summary: 'Listar reservas pendentes de assentos',
  })
  async listReservations(@CurrentUser() user: RequestUser) {
    return this.adminService.listActiveReservations(user.company_id);
  }

  @Delete('reservations/:id')
  @RequirePermission('showtimes', 'delete')
  @ApiOperation({
    summary: 'Liberar/cancelar reserva pendente',
  })
  async cancelReservation(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    await this.adminService.cancelReservation(user.company_id, id);
    return { success: true };
  }

  @Get('tickets/:id/qr-code')
  @RequirePermission('tickets', 'read')
  @ApiOperation({
    summary: 'Obter QR Code de um ingresso (uso administrativo)',
  })
  async getTicketQrCode(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.getTicketQrCode(user.company_id, id);
  }
}
