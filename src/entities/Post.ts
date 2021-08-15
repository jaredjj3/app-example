import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
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
  get authorId() {
    return this.author?.id;
  }

  set authorId(authorId: number) {
    if (this.authorId === authorId) {
      return;
    }
    if (!this.em) {
      throw new Error('must assign EntityManager to assign by foreign key');
    }
    wrap(this).assign({ author: authorId }, { em: this.em });
  }

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags = new Collection<PostTag>(this);

  @ManyToMany({ entity: () => Tag, pivotTable: 'post_tags' })
  tags = new Collection<Tag>(this);

  constructor(props: Partial<Post> = {}, opts: BaseOpts = {}) {
    super(opts);
    Object.assign(this, props);
  }
}
