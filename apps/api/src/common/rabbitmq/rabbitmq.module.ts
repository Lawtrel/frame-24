import { Module, Global } from '@nestjs/common';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';
import { LoggerService } from '../services/logger.service';

@Global()
@Module({
  providers: [RabbitMQPublisherService, LoggerService],
  exports: [RabbitMQPublisherService, LoggerService],
})
export class RabbitMQModule {}
