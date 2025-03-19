import { IsEnum } from 'class-validator';
import { CommentLikeType } from './list-all-comment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LikeCommentDto {
  @IsEnum(CommentLikeType)
  @ApiProperty({
    enum: CommentLikeType,
    example: CommentLikeType.LIKE,
    description: '좋아요 타입',
  })
  type: CommentLikeType;
}
