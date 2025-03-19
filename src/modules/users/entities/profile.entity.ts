import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from './user.entity';

@Entity()
export class Profile extends BaseEntity {
  @Column()
  avatarUrl: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
