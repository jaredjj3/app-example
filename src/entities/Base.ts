import { BeforeCreate, BeforeUpdate } from '@mikro-orm/core';
import { validate } from 'class-validator';

export class ValidationError extends Error {
  details: string[];

  constructor(details: string[]) {
    const plural = details.length > 0;
    super(`validation ${plural ? 'errors' : 'error'}: ${details.join(', ')}`);
    this.details = details;
  }
}

export abstract class Base {
  async isValid(): Promise<boolean> {
    const errors = await this.errors();
    return errors.length === 0;
  }

  async errors(): Promise<string[]> {
    const errors = await validate(this);
    return errors.flatMap((error) => Object.values(error.constraints || []));
  }

  @BeforeCreate()
  @BeforeUpdate()
  async validate() {
    const details = await this.errors();
    if (details.length > 0) {
      throw new ValidationError(details);
    }
  }
}
