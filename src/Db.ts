import { MikroORM } from '@mikro-orm/core';
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

  async close() {
    if (this.isConnected) {
      await this.orm.close(true);
    }
    this.isConnected = false;
  }

  async cleanup() {
    // TODO(jared) Add entities to delete here.
    this.orm.em.clear();
  }
}
