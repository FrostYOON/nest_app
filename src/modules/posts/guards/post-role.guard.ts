import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User, UserRole } from 'src/modules/users/entities/user.entity';
import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PostRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    const postId = request.params.postId;
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    if (!post.user) {
      throw new NotFoundException('게시글 작성자 정보를 찾을 수 없습니다.');
    }

    if (user.id !== post.user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('해당 게시글에 대한 권한이 없습니다.');
    }

    return true;
  }
}
