import { Module } from '@nestjs/common';
import { AuditWorkerService } from './audit-worker.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ElasticsearchModule } from 'src/common/elasticsearch/elasticsearch.module';
import { RabbitMQModule } from 'src/common/rabbitmq/rabbitmq.module';
import { CommonModule } from 'src/common/common.module';
import { AuditConsumerService } from 'src/workers/audit-consumer.service';

@Module({
  imports: [PrismaModule, ElasticsearchModule, CommonModule, RabbitMQModule],
  providers: [AuditWorkerService, AuditConsumerService],
})
export class WorkersModule {}
