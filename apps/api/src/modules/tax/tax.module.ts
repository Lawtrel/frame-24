import { Module } from '@nestjs/common';
import { MunicipalTaxParametersRepository } from './repositories/municipal-tax-parameters.repository';
import { FederalTaxRatesRepository } from './repositories/federal-tax-rates.repository';

@Module({
  providers: [MunicipalTaxParametersRepository, FederalTaxRatesRepository],
  exports: [MunicipalTaxParametersRepository, FederalTaxRatesRepository],
})
export class TaxModule {}
