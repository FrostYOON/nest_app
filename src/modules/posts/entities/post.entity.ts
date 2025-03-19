import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { PostView } from './post-view.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => PostView, (postView) => postView.post)
  postViews: PostView[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
