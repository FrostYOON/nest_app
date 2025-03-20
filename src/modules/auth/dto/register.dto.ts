import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterType } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'test@test.com',
  })
  email: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: '!Password123',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '이름',
    example: '홍길동',
  })
  name: string;

  @IsOptional()
  @IsString()
  socialId: string;

  @IsOptional()
  @IsEnum(RegisterType)
  registerType: RegisterType;
}
