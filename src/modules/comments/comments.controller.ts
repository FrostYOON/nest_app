import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ListAllCommentsDto } from './dto/list-all-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { CommentRoleGuard } from './guards/comment-role.guard';

@ApiTags('댓글')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @Post()
  @ApiOperation({
    summary: '댓글 생성',
    description: '댓글을 생성합니다.',
  })
  @ApiParam({
    name: 'postId',
    description: '게시글 ID',
    example: '게시글 ID',
  })
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @RequestUser() user: User,
    @Param('postId') postId: string,
  ) {
    return this.commentsService.createComment(createCommentDto, user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @Post(':commentId/replies')
  @ApiOperation({
    summary: '대댓글 생성',
    description: '대댓글을 생성합니다.',
  })
  @ApiParam({
    name: 'postId',
    description: '게시글 ID',
    example: '게시글 ID',
  })
  @ApiParam({
    name: 'commentId',
    description: '댓글 ID',
    example: '댓글 ID',
  })
  createReply(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @RequestUser() user: User,
  ) {
    return this.commentsService.createReply(
      createCommentDto,
      postId,
      commentId,
      user,
    );
  }

  @Get()
  @HttpCode(200)
  @ApiParam({
    name: 'postId',
    description: '게시글 ID',
    example: '게시글 ID',
  })
  @ApiOperation({
    summary: '댓글 목록 조회',
    description: '댓글 목록을 조회합니다.',
  })
  findAll(
    @Query() listAllCommentsDto: ListAllCommentsDto,
    @Param('postId') postId: string,
  ) {
    return this.commentsService.findComments(listAllCommentsDto, postId);
  }

  @Get(':postId')
  @HttpCode(200)
  @ApiParam({
    name: 'postId',
    description: '게시글 ID',
    example: '게시글 ID',
  })
  @ApiOperation({
    summary: '게시글 댓글 목록 조회',
    description: '게시글 댓글 목록을 조회합니다.',
  })
  findByPostId(
    @Query('limit') limit: number = 10,
    @Param('postId') postId: string,
  ) {
    return this.commentsService.findCommentsByPostId(limit, postId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Get(':commentId')
  @ApiOperation({
    summary: '댓글 상세 조회',
    description: '댓글을 상세하게 조회합니다.',
  })
  findOne(@Param('commentId') id: string, @RequestUser() user: User) {
    return this.commentsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard, CommentRoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Patch(':commentId')
  @ApiOperation({
    summary: '댓글 수정',
    description: '댓글을 수정합니다.',
  })
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard, CommentRoleGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @Delete(':commentId')
  @ApiOperation({
    summary: '댓글 삭제',
    description: '댓글을 삭제합니다.',
  })
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.removeComment(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':commentId/like')
  @ApiOperation({
    summary: '댓글 좋아요/싫어요',
    description: '댓글을 좋아요/싫어요 합니다.',
  })
  likeComment(
    @Param('commentId') id: string,
    @Body() likeCommentDto: LikeCommentDto,
  ) {
    return this.commentsService.likeComment(id, likeCommentDto.type);
  }
}
