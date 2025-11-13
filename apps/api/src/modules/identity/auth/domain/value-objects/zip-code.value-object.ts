import { BadRequestException } from '@nestjs/common';

export class ZipCode {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(zipCode: string): ZipCode {
    const normalized = zipCode.replace(/\D/g, '');

    if (normalized.length !== 8) {
      throw new BadRequestException('CEP deve conter 8 dígitos');
    }

    return new ZipCode(normalized);
  }

  get value(): string {
    return this._value;
  }

  formatted(): string {
    return this._value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  toString(): string {
    return this._value;
  }
}
