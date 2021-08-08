import { BeforeCreate, BeforeUpdate } from '@mikro-orm/core';
import classValidator from 'class-validator';

class ValidationError extends Error {
  details: string[];

  constructor(details: string[]) {
    const plural = details.length > 0;
    super(`validation ${plural ? 'errors' : 'error'}: ${details.join(', ')}`);
    this.details = details;
  }
}

export abstract class Base {
  async errors(): Promise<string[]> {
    const errors = await classValidator.validate(this, {
      validationError: {
        target: false,
        value: false,
      },
    });

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
