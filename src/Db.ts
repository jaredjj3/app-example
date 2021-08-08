import { MikroORM, UnderscoreNamingStrategy } from 'mikro-orm';

export class Db {
  private static instanceRef: Db | undefined;

  static get instance() {
    if (typeof Db.instanceRef === 'undefined') {
      this.instanceRef = new Db();
    }
    return this.instanceRef;
  }

  private didInit = false;
  private ormRef: MikroORM;

  private constructor() {}

  async init() {
    if (this.didInit) {
      return;
    }
    this.ormRef = await MikroORM.init({
      type: 'postgresql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      dbName: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      namingStrategy: UnderscoreNamingStrategy,
      entities: [],
      discovery: {
        requireEntitiesArray: false,
        warnWhenNoEntities: false,
      },
    });
    this.didInit = true;
  }

  get orm(): MikroORM {
    if (typeof this.ormRef === 'undefined') {
      throw new Error('must call Db.init before accessing orm');
    }
    return this.ormRef;
  }

  async close() {
    if (this.didInit) {
      await this.orm.close(true);
    }
  }

  async cleanup() {
    // TODO(jared) Add entities to delete here.
    this.orm.em.clear();
  }
}
