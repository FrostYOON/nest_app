import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ErrorHandlingMiddleware } from '../../middlewares/error-handling.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { S3Module } from '../s3/s3.module';
import { ImagesModule } from '../images/images.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    S3Module,
    ImagesModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecret,
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [AppConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
  }
}
