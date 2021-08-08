require('ts-node/register');

import { Db } from '../Db';

module.exports = async () => {
  const db = Db.instance;

  await db.init();
  const migrator = db.orm.getMigrator();
  await migrator.up();
};
