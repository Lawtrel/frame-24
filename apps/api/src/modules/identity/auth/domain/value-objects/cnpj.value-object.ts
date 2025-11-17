import { BadRequestException } from '@nestjs/common';

export class Cnpj {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(cnpj: string): Cnpj {
    const normalized = cnpj.replace(/\D/g, '');

    if (normalized.length !== 14) {
      throw new BadRequestException('CNPJ deve conter 14 dígitos');
    }

    if (!this.isValid(normalized)) {
      throw new BadRequestException('CNPJ inválido');
    }

    return new Cnpj(normalized);
  }

  private static isValid(cnpj: string): boolean {
    return !/^(\d)\1{13}$/.test(cnpj);
  }

  get value(): string {
    return this._value;
  }

  formatted(): string {
    return this._value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  toString(): string {
    return this._value;
  }
}
