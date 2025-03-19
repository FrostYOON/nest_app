import { Entity, ManyToOne, Column, OneToMany, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Index()
  parent: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    nullable: true,
  })
  children: Comment[];

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  dislikeCount: number;
}
