import { Db } from './Db';

describe('mikro-orm', () => {
  let db: Db;

  beforeEach(async () => {
    db = Db.instance;
  });
});
