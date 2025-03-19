import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderByOption {
  CREATED_AT = 'createdAt',
}

export enum CommentLikeType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export class ListAllCommentsDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: '게시글 ID',
    required: false,
  })
  postId: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: '부모 댓글 ID',
    required: false,
  })
  parentId: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: '유저 ID',
    required: false,
  })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '댓글 내용',
    required: false,
  })
  content: string;

  @IsOptional()
  @IsEnum(CommentLikeType)
  @ApiProperty({
    enum: CommentLikeType,
    description: '좋아요 타입',
    required: false,
  })
  likeType: CommentLikeType;

  @IsOptional()
  @IsEnum(CommentLikeType)
  @ApiProperty({
    enum: CommentLikeType,
    description: '싫어요 타입',
    required: false,
  })
  dislikeType: CommentLikeType;

  @IsOptional()
  @IsEnum(OrderByOption)
  @ApiProperty({
    enum: OrderByOption,
    description: '정렬 기준',
    required: false,
    default: OrderByOption.CREATED_AT,
  })
  orderBy: OrderByOption = OrderByOption.CREATED_AT;

  @IsOptional()
  @IsEnum(Order)
  @ApiProperty({
    enum: Order,
    description: '정렬 방향',
    required: false,
    default: Order.DESC,
  })
  order: Order = Order.DESC;
}
