import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new NestLogger();

  log(message: string, context?: string, metadata?: any) {
    this.logger.log(message, context);
    if (metadata) {
      this.logger.log(JSON.stringify(metadata, null, 2), context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace || '', context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string, metadata?: any) {
    this.logger.debug(message, context);
    if (metadata) {
      this.logger.debug(JSON.stringify(metadata, null, 2), context);
    }
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }
}
