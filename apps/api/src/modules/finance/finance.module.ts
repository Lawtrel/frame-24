import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { ChartOfAccountsController } from './controllers/chart-of-accounts.controller';
import { JournalEntriesController } from './controllers/journal-entries.controller';
import { DistributorSettlementsController } from './controllers/distributor-settlements.controller';
import { FinanceReportsController } from './controllers/finance-reports.controller';
import { ChartOfAccountsService } from './services/chart-of-accounts.service';
import { JournalEntriesService } from './services/journal-entries.service';
import { DistributorSettlementsService } from './services/distributor-settlements.service';
import { FinanceReportsService } from './services/finance-reports.service';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [
    ChartOfAccountsController,
    JournalEntriesController,
    DistributorSettlementsController,
    FinanceReportsController,
  ],
  providers: [
    ChartOfAccountsService,
    JournalEntriesService,
    DistributorSettlementsService,
    FinanceReportsService,
  ],
  exports: [
    ChartOfAccountsService,
    JournalEntriesService,
    DistributorSettlementsService,
    FinanceReportsService,
  ],
})
export class FinanceModule {}
