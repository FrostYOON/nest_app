import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class PostView extends BaseEntity {
  @ManyToOne(() => User, (user) => user.postViews)
  user: User;

  @ManyToOne(() => Post, (post) => post.postViews)
  post: Post;
}
