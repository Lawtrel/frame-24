import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { SnowflakeService } from './services/snowflake.service';
import { RabbitMQModule } from 'src/common/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [LoggerService, SnowflakeService],
  exports: [RabbitMQModule, LoggerService, SnowflakeService],
})
export class CommonModule {}
