import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { SnowflakeService } from './services/snowflake.service';
import { BrasilApiService } from './services/brasil-api.service';
import { RabbitMQModule } from 'src/common/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [LoggerService, SnowflakeService, BrasilApiService],
  exports: [RabbitMQModule, LoggerService, SnowflakeService, BrasilApiService],
})
export class CommonModule {}
