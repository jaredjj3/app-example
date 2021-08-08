import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Post, PostTag, Tag, User } from './entities';

export const config: Options = {
  type: 'postgresql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  namingStrategy: UnderscoreNamingStrategy,
  entities: [User, Post, Tag, PostTag],
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
