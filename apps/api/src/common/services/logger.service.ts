import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new NestLogger();

  log(message: string, context?: string, metadata?: any) {
    this.logger.log(`${message}`, context);
    if (metadata) console.log(metadata);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(`${message} - ${trace}`, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string, metadata?: any) {
    this.logger.debug(`${message}`, context);
    if (metadata) console.log(metadata);
  }
}
