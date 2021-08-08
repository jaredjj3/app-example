import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';

export const config: Options = {
  type: 'postgresql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  namingStrategy: UnderscoreNamingStrategy,
  entities: [],
  tsNode: true,
  discovery: {
    requireEntitiesArray: false,
    warnWhenNoEntities: false,
  },
  migrations: {
    path: './src/migrations',
  },
};

export default config;
