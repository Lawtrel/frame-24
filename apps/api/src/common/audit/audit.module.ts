import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuditLogController } from './controllers/audit-log.controller';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { RolesModule } from 'src/modules/identity/roles/roles.module';
import { ElasticsearchModule } from 'src/common/elasticsearch/elasticsearch.module';

@Module({
  imports: [PrismaModule, RolesModule, ElasticsearchModule],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService],
})
export class AuditModule {}
