import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { DbConfigModule } from './config/db/config.module';
import { AppConfigModule } from './config/app/config.module';
import { AwsConfigModule } from './config/aws/config.module';
import { S3Module } from './modules/s3/s3.module';
import { AppDataSource } from './ormConfig';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ImagesModule } from './modules/images/images.module';
import { SocialConfigModule } from './config/social/config.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    DbConfigModule,
    AppConfigModule,
    AwsConfigModule,
    SocialConfigModule,
    S3Module,
    PostsModule,
    CommentsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
