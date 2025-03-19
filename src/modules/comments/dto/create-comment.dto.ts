import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용',
  })
  @IsNotEmpty()
  content: string;
}
