import { EntityManager, LoadStrategy, wrap } from '@mikro-orm/core';
import { Db } from './Db';
import { Post, User, ValidationError } from './entities';
import * as rand from './testing/rand';

describe('mikro-orm', () => {
  let db: Db;
  let em: EntityManager;
  let executeQuerySpy: jest.SpyInstance;

  beforeEach(async () => {
    db = Db.instance;
    em = db.em;
    // executeQuery is protected
    // https://github.com/mikro-orm/mikro-orm/blob/44998383b21a3aef943a922a3e75426369178f35/packages/core/src/connections/Connection.ts#L95
    executeQuerySpy = jest.spyOn(db.orm.em.getConnection() as any, 'executeQuery');
  });

  const getNumDbCalls = () => executeQuerySpy.mock.calls.length;

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

  describe('"belongs to" relationships', () => {
    it('allows creating using a reference', async () => {
      const post = new Post({ title: rand.str(8) });
      const user = new User({ username: rand.str(8) });
      post.author = wrap(user).toReference();

      em.persist(post);
      await em.flush();

      await expect(em.count(Post)).resolves.toBe(1);
      await expect(em.count(User)).resolves.toBe(1);
      expect(post.author.getEntity()).toBe(user);
      expect(user.posts.contains(post)).toBeTrue();
    });

    it('allows association using the foreign key', async () => {
      // Create a new user and clear cache to simulate a "clean slate".
      const user = new User({ username: rand.str(8) });
      em.persist(user);
      await em.flush();
      em.clear();

      const post = new Post({ title: rand.str(8), authorId: user.id });
      em.persist(post);
      await em.flush();
      em.clear();

      await expect(em.count(Post)).resolves.toBe(1);
      await expect(em.count(User)).resolves.toBe(1);

      const actualPost = await em.findOne(Post, { authorId: user.id }, { populate: { author: LoadStrategy.JOINED } });
      expect(actualPost).not.toBeNull();
      expect(actualPost!.author).toBeDefined();
      expect(actualPost!.author!.id).toBe(user.id);
      expect(actualPost!.authorId).toBe(user.id);
    });

    it('can load an association made by a reference', async () => {
      const post = new Post({ title: rand.str(8) });
      const user = new User({ username: rand.str(8) });
      post.author = wrap(user).toReference();

      em.persist(user);
      em.persist(post);
      await em.flush();
      em.clear();

      await expect(em.count(Post)).resolves.toBe(1);
      await expect(em.count(User)).resolves.toBe(1);

      // Assert that we have a brand new post entity.
      const actualPost = await em.findOne(Post, { authorId: user.id }, { populate: { author: LoadStrategy.JOINED } });
      expect(actualPost).not.toBeNull();
      expect(actualPost).not.toBe(post);

      // Assert that we can load the author association and it doesn't trigger
      // a database call since it was joined.
      const prevNumDbCalls = getNumDbCalls();
      await expect(actualPost!.author.load()).resolves.not.toThrow();
      const currNumDbCalls = getNumDbCalls();
      expect(currNumDbCalls - prevNumDbCalls).toBe(0);
    });

    it('can load an association made by a foreign key', async () => {
      // Create a new user and clear cache to simulate a "clean slate".
      const user = new User({ username: rand.str(8) });
      em.persist(user);
      await em.flush();
      em.clear();

      const post = new Post({ title: rand.str(8), authorId: user.id });
      em.persist(post);
      await em.flush();
      em.clear();

      // Assert that we have a brand new post entity.
      const actualPost = await em.findOne(Post, { authorId: user.id }, { populate: { author: LoadStrategy.JOINED } });
      expect(actualPost).not.toBeNull();

      // Assert that we can load the author association and it doesn't trigger
      // a database call since it was joined.
      const prevNumDbCalls = getNumDbCalls();
      await expect(actualPost!.author.load()).resolves.not.toThrow();
      const currNumDbCalls = getNumDbCalls();
      expect(currNumDbCalls - prevNumDbCalls).toBe(0);
    });

    it('disallows creating with invalid relationships', async () => {
      const post = new Post({ title: rand.str(8) });
      const user = new User();
      post.author = wrap(user).toReference();

      em.persist(post);
      await expect(em.flush()).rejects.toThrow(ValidationError);

      await expect(em.count(Post)).resolves.toBe(0);
      await expect(em.count(User)).resolves.toBe(0);
    });

    it('disallows missing relationships marked as required', async () => {
      // Posts must have an author.
      const post = new Post({ title: rand.str(8) });
      await expect(post.isValid()).resolves.toBeFalse();

      em.persist(post);
      await expect(em.flush()).rejects.toThrow(ValidationError);

      await expect(em.count(Post)).resolves.toBe(0);
      await expect(em.count(User)).resolves.toBe(0);
    });
  });

  describe('"has many" relationships', () => {
    it('allows creating using a reference', async () => {
      const post = new Post({ title: rand.str(8) });
      const user = new User({ username: rand.str(8) });
      user.posts.add(post);

      em.persist(post);
      await em.flush();

      await expect(em.count(Post)).resolves.toBe(1);
      await expect(em.count(User)).resolves.toBe(1);
      expect(post.author.getEntity()).toBe(user);
      expect(user.posts.contains(post)).toBeTrue();
    });

    it('disallows creating with invalid relationships', async () => {
      const post = new Post({ title: rand.str(8) });
      const user = new User();
      user.posts.add(post);

      em.persist(post);
      await expect(em.flush()).rejects.toThrow(ValidationError);

      await expect(em.count(Post)).resolves.toBe(0);
      await expect(em.count(User)).resolves.toBe(0);
    });
  });
});
