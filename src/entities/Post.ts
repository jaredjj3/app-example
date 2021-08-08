import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Base } from './Base';
import { PostTag } from './PostTag';
import { Tag } from './Tag';
import { User } from './User';

@Entity({ tableName: 'posts' })
export class Post extends Base {
  @PrimaryKey()
  id!: number;

  @Property()
  @MinLength(3)
  @MaxLength(16)
  title!: string;

  @ManyToOne(() => User, { wrappedReference: true })
  @IsNotEmpty()
  author?: IdentifiedReference<User, 'id'>;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags = new Collection<PostTag>(this);

  @ManyToMany({ entity: () => Tag, pivotTable: 'post_tags' })
  tags = new Collection<Tag>(this);

  constructor(props: Partial<Post> = {}) {
    super();
    Object.assign(this, props);
  }
}