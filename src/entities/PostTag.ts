import { Entity, IdentifiedReference, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { Base } from './Base';
import { Post } from './Post';
import { Tag } from './Tag';

@Entity({ tableName: 'post_tags' })
export class PostTag extends Base {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, { wrappedReference: true })
  @IsNotEmpty()
  post?: IdentifiedReference<Post, 'id'>;

  @ManyToOne(() => Tag, { wrappedReference: true })
  @IsNotEmpty()
  tag?: IdentifiedReference<Tag, 'id'>;

  constructor(props: Partial<PostTag> = {}) {
    super();
    Object.assign(this, props);
  }
}
