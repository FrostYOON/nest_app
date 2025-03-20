import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Post } from '../../posts/entities/post.entity';
import { PostView } from '../../posts/entities/post-view.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum RegisterType {
  COMMON = 'common',
  GOOGLE = 'google',
  KAKAO = 'kakao',
  APPLE = 'apple',
  NAVER = 'naver',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  socialId: string;

  @Column({
    type: 'enum',
    enum: RegisterType,
    default: RegisterType.COMMON,
  })
  registerType: RegisterType;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostView, (postView) => postView.user)
  postViews: PostView[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
