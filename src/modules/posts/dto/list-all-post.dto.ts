import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderByOption {
  CREATED_AT = 'createdAt',
  VIEW_COUNT = 'viewCount',
}

export class ListAllPostsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '검색할 제목',
    required: false,
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '검색할 내용',
    required: false,
  })
  content: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '검색할 유저 아이디',
    required: false,
  })
  userId: string;

  @IsOptional()
  @IsEnum(OrderByOption)
  @ApiProperty({
    enum: OrderByOption,
    description: '정렬할 필드',
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
