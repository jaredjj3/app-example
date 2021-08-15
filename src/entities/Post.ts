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
import { ForeignKey } from '../decorators/ForeignKey';
import { Base, BaseOpts } from './Base';
import { PostTag } from './PostTag';
import { Tag } from './Tag';
import { User } from './User';

@Entity({ tableName: 'posts' })
export class Post extends Base {
  @PrimaryKey()
  id!: number;

  @Property()
  @MinLength(3)
  @MaxLength(64)
  title!: string;

  @ManyToOne(() => User, { wrappedReference: true })
  @IsNotEmpty()
  author?: IdentifiedReference<User, 'id'>;

  @Property({ persist: false })
  @ForeignKey<Post, number>('author')
  authorId!: number;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags = new Collection<PostTag>(this);

  @ManyToMany({ entity: () => Tag, pivotTable: 'post_tags' })
  tags = new Collection<Tag>(this);

  constructor(props: Partial<Post> = {}, opts: BaseOpts = {}) {
    super(opts);
    Object.assign(this, props);
  }
}
