import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { LoggerService } from '../services/logger.service';

@Module({
  providers: [ElasticsearchService, LoggerService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
