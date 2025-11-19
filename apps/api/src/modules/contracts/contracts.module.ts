import { Module } from '@nestjs/common';
import { ExhibitionContractsRepository } from './repositories/exhibition-contracts.repository';

@Module({
  providers: [ExhibitionContractsRepository],
  exports: [ExhibitionContractsRepository],
})
export class ContractsModule {}
