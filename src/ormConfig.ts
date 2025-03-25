import { join } from 'path';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { DbConfigService } from './config/db/config.service';
import { ConfigService } from '@nestjs/config';
import { PostViewSubscriber } from './modules/posts/subscribers/post-view.subscriber';
import { CommentSubscriber } from './modules/comments/subscribers/comment.subscriber';
import { UserSubscriber } from './modules/users/subscribers/user.subscriber';

const entities = [join(__dirname, '/**/*.entity{.ts,.js}')];
const migrations = [join(__dirname, './migrations/**/*{.ts,.js}')];
const dbConfigService = new DbConfigService(new ConfigService());

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbConfigService.dbHost,
  port: dbConfigService.dbPort,
  username: dbConfigService.dbUser,
  password: dbConfigService.dbPassword,
  database: dbConfigService.dbName,
  entities,
  migrations,
  synchronize: false,
  logging: true,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  subscribers: [PostViewSubscriber, CommentSubscriber, UserSubscriber],
});
