import { EntityManager } from '@mikro-orm/core';
import { Db } from './Db';
import { User } from './entities';
import { ValidationError } from './entities/Base';
import * as rand from './testing/rand';

describe('mikro-orm', () => {
  let db: Db;
  let em: EntityManager;

  beforeEach(async () => {
    db = Db.instance;
    em = db.em;
  });

  describe('CRUD', () => {
    it('allows creating valid User entities', async () => {
      const username = rand.str(8);
      const user = new User({ username });
      await expect(user.isValid()).resolves.toBeTrue();

      em.persist(user);
      await em.flush();

      await expect(em.count(User)).resolves.toBe(1);
      const actualUser = await em.findOne(User, { username });
      expect(actualUser).not.toBeNull();
      expect(actualUser!.username).toBe(username);
    });

    it('disallows creating invalid User entities', async () => {
      const user = new User();
      await expect(user.isValid()).resolves.toBeFalse();

      em.persist(user);
      await expect(em.flush()).rejects.toThrow(ValidationError);

      await expect(em.count(User)).resolves.toBe(0);
    });
  });
});
