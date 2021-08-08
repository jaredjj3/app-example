import { Migration } from '@mikro-orm/migrations';

export class Migration20210808014510 extends Migration {
  async up(): Promise<void> {
    await this.execute(`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username text UNIQUE NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author_id integer REFERENCES users (id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  id SERIAL PRIMARY KEY,
  post_id integer REFERENCES posts (id),
  tag_id integer REFERENCES tags (id)
);
  `);
  }
}
