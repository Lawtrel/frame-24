import { Module } from '@nestjs/common';
import { CinemaComplexesModule } from './cinema-complexes/cinema-complexes.module';

@Module({
  imports: [CinemaComplexesModule],
})
export class OperationsModule {}
