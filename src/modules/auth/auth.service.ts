import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../../utils/password-util';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { LogInDto } from './dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { AppConfigService } from '../../config/app/config.service';
import { ImagesService } from '../images/images.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly imagesService: ImagesService,
  ) {}

  // 회원가입
  async register(registerDto: RegisterDto): Promise<ResponseRegisterDto> {
    // registerDto.password = await encryptPassword(registerDto.password);
    return await this.usersService.createUser(registerDto);
  }

  // 로그인
  async logIn(logInDto: LogInDto, requestOrigin: string) {
    const user = await this.usersService.findUserByEmail(logInDto.email);

    const isPasswordValid = await comparePassword(
      logInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return this.jwtTokenBuilder(logInDto.email, requestOrigin);
  }

  googleLogIn(email: string, requestOrigin: string) {
    return this.jwtTokenBuilder(email, requestOrigin);
  }

  jwtTokenBuilder(email: string, requestOrigin: string) {
    const { accessToken, accessOptions } = this.setJwtAccessToken(
      email,
      requestOrigin,
    );
    const { refreshToken, refreshOptions } = this.setJwtRefreshToken(
      email,
      requestOrigin,
    );

    return {
      message: '로그인 성공',
      accessToken,
      refreshToken,
      accessOptions,
      refreshOptions,
    };
  }

  setCookieOptions(maxAge: number, requestDomain: string): CookieOptions {
    let domain: string;

    if (
      requestDomain.includes('localhost') ||
      requestDomain.includes('127.0.0.1')
    ) {
      domain = 'localhost';
    } else {
      domain = requestDomain.split(':')[0];
    }

    return {
      httpOnly: true,
      secure: requestDomain.includes('localhost') ? false : true,
      maxAge,
      path: '/',
      domain,
      sameSite: 'lax',
    };
  }

  // JWT 토큰 발급
  setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { email };
    const maxAge = 1000 * 60 * 60; // 1 hour
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge,
    });
    return {
      accessToken,
      accessOptions: this.setCookieOptions(maxAge, requestDomain),
    };
  }

  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { email };
    const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge,
    });
    return {
      refreshToken,
      refreshOptions: this.setCookieOptions(maxAge, requestDomain),
    };
  }

  expireJwtToken(requestOrigin: string) {
    return {
      accessOptions: this.setCookieOptions(0, requestOrigin),
      refreshOptions: this.setCookieOptions(0, requestOrigin),
    };
  }

  // async uploadProfile(file: Express.Multer.File) {
  //   return await this.imagesService.uploadImage(file);
  // }
}
