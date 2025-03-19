import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @ApiProperty({
    description: '한 번에 가져올 데이터의 개수',
    required: false,
    default: 10,
  })
  limit: number = 10;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @ApiProperty({
    description: '페이지 번호',
    required: false,
    default: 1,
  })
  offset: number = 1;
}
