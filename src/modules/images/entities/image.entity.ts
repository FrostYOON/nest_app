import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('images')
export class Image extends BaseEntity {
  @Column()
  imageUrl: string;

  @Column()
  filePath: string;
}
