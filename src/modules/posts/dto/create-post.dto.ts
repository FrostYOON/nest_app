import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: '게시글 제목',
    example: '게시글 제목',
  })
  title: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: '게시글 내용',
    example: '게시글 내용',
  })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: '게시글 썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnailUrl: string;
}
