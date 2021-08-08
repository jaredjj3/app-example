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
      // Create a valid new user in memory.
      const username = rand.str(8);
      const user = new User({ username });
      await expect(user.isValid()).resolves.toBeTrue();

      // Persist user to db.
      em.persist(user);
      await em.flush();

      // Assert that a user was created and is queryable by username.
      await expect(em.count(User)).resolves.toBe(1);
      const actualUser = await em.findOne(User, { username });
      expect(actualUser).not.toBeNull();
      expect(actualUser!.username).toBe(username);
    });

    it('disallows creating invalid User entities', async () => {
      // Create an invalid new user in memory.
      const user = new User();
      await expect(user.isValid()).resolves.toBeFalse();

      // Assert persisting user to db throws an error.
      em.persist(user);
      await expect(em.flush()).rejects.toThrow(ValidationError);

      // Assert that no user was created.
      await expect(em.count(User)).resolves.toBe(0);
    });

    it('disallows updating invalid User entities', async () => {
      // Create a new user in memory.
      const username = rand.str(8);
      const user = new User({ username });

      // Persist user to db.
      em.persist(user);
      await em.flush();

      // Make in memory user invalid.
      user.username = '';
      await expect(user.isValid()).resolves.toBeFalse();

      // Assert persisting user to db throws an error.
      em.persist(user);
      await expect(em.flush()).rejects.toThrow(ValidationError);

      // Assert querying user returns the in-memory user.
      await expect(em.count(User)).resolves.toBe(1);
      const inMemoryUser = await em.findOne(User, { username });
      expect(inMemoryUser).not.toBeNull();
      expect(inMemoryUser!).toBe(user);
      expect(inMemoryUser!.username).toBeEmpty();

      // Clear in-memory cache.
      em.clear();

      // Assert querying user returns the db user.
      const actualUser = await em.findOne(User, { username });
      expect(actualUser).not.toBeNull();
      expect(actualUser!).not.toBe(user);
      expect(actualUser!.username).toBe(username);
    });
  });
});
