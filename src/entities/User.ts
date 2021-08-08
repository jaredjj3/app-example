import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Base } from './Base';
import { Post } from './Post';

@Entity({ tableName: 'users' })
export class User extends Base {
  @PrimaryKey()
  id!: number;

  @Property()
  @MinLength(3)
  @MaxLength(24)
  username!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts = new Collection<Post>(this);

  constructor(props: Partial<User> = {}) {
    super();
    Object.assign(this, props);
  }
}
