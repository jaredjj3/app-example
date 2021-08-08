import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { MaxLength, MinLength } from 'class-validator';
import { Base } from './Base';
import { Post } from './Post';
import { PostTag } from './PostTag';

@Entity({ tableName: 'tags' })
export class Tag extends Base {
  @PrimaryKey()
  id!: number;

  @Property()
  @MinLength(3)
  @MaxLength(16)
  name!: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags = new Collection<PostTag>(this);

  @ManyToMany({ entity: () => Post, mappedBy: 'tags' })
  posts = new Collection<PostTag>(this);

  constructor(props: Partial<Tag> = {}) {
    super();
    Object.assign(this, props);
  }
}
