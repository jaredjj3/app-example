import { EntityManager, MikroORM } from '@mikro-orm/core';
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
    const connection = this.orm.em.getConnection();
    await connection.execute(`TRUNCATE TABLE users, posts, post_tags, tags RESTART IDENTITY`);
    this.orm.em.clear();
  }
}
