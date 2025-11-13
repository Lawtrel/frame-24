import { BadRequestException } from '@nestjs/common';

export class Mobile {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(mobile: string): Mobile {
    const normalized = mobile.replace(/\D/g, '');

    if (normalized.length < 10 || normalized.length > 11) {
      throw new BadRequestException('Telefone deve ter 10 ou 11 dígitos');
    }

    return new Mobile(normalized);
  }

  get value(): string {
    return this._value;
  }

  formatted(): string {
    if (this._value.length === 11) {
      return this._value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    return this._value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }

  toString(): string {
    return this._value;
  }
}
