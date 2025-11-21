import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ClsModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
