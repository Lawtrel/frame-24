import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { SnowflakeService } from './services/snowflake.service';
import { BrasilApiService } from './services/brasil-api.service';
import { RabbitMQModule } from 'src/common/rabbitmq/rabbitmq.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [RabbitMQModule, CacheModule],
  providers: [LoggerService, SnowflakeService, BrasilApiService],
  exports: [RabbitMQModule, LoggerService, SnowflakeService, BrasilApiService, CacheModule],
})
export class CommonModule { }
