import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Post, PostTag, Tag, User } from './entities';
import { config } from './mikro-orm.config';

export class Db {
  private static _instance: Db | undefined;

  static get instance() {
    if (typeof Db._instance === 'undefined') {
      this._instance = new Db();
    }
    return this._instance;
  }

  private isConnected = false;
  private _orm: MikroORM;

  private constructor() {}

  async init() {
    if (this.isConnected) {
      return;
    }
    this._orm = await MikroORM.init(config);
    this.isConnected = true;
  }

  get orm(): MikroORM {
    if (typeof this._orm === 'undefined') {
      throw new Error('must call Db.init before accessing Db.orm');
    }
    return this._orm;
  }

  get em(): EntityManager {
    return this.orm.em;
  }

  async close() {
    if (this.isConnected) {
      await this.orm.close(true);
    }
    this.isConnected = false;
  }

  async cleanup() {
    await this.orm.em.nativeDelete(User, {});
    await this.orm.em.nativeDelete(Post, {});
    await this.orm.em.nativeDelete(Tag, {});
    await this.orm.em.nativeDelete(PostTag, {});
    this.orm.em.clear();
  }
}
