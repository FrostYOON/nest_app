import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User, UserRole } from 'src/modules/users/entities/user.entity';
import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CommentRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    const commentId = request.params.commentId;
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    // user 객체가 없는 경우 처리
    if (!comment.user) {
      throw new NotFoundException('댓글 작성자 정보를 찾을 수 없습니다.');
    }

    if (user.id !== comment.user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('해당 댓글에 대한 권한이 없습니다.');
    }
    return true;
  }
}
