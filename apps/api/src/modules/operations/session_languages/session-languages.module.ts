import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionLanguagesController } from './controllers/session-languages.controller';
import { SessionLanguagesRepository } from './repositories/session-languages.repository';
import { SessionLanguagesService } from './services/session-languages.service';

@Module({
  imports: [PrismaModule],
  controllers: [SessionLanguagesController],
  providers: [SessionLanguagesService, SessionLanguagesRepository],
  exports: [SessionLanguagesRepository],
})
export class SessionLanguagesModule {}
