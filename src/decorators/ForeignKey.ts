import { wrap } from '@mikro-orm/core';
import { Base } from '../entities';

type Key = number | string;

export const ForeignKey = <T extends Base, K extends Key>(association: keyof T) => {
  return ((target: T, propertyKey: PropertyKey, descriptor: PropertyDescriptor = {}) => {
    const getKey = function (this: T): K {
      return (this[association] as any)?.id;
    };

    const setKey = function (this: T, key: K) {
      if (getKey.call(this) === key) {
        return;
      }
      if (!this.em) {
        throw new Error('must set EntityManager before assigning by foreign key');
      }
      wrap(this).assign({ [association]: key }, { em: this.em });
    };

    descriptor.get = getKey;
    descriptor.set = setKey;
    return descriptor;
  }) as any;
};
