import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListAllPostsDto } from './dto/list-all-post.dto';
import { PostRoleGuard } from './guards/post-role.guard';

@ApiTags('게시글')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: '게시글 생성', description: '게시글을 생성합니다.' })
  createPost(@Body() createPostDto: CreatePostDto, @RequestUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Get()
  @ApiOperation({
    summary: '게시글 목록 조회',
    description: '게시글 목록을 조회합니다.',
  })
  findAll(@Query() listAllPostsDto: ListAllPostsDto) {
    return this.postsService.findAll(listAllPostsDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: '게시글 상세 조회',
    description: '게시글을 상세하게 조회합니다.',
  })
  findOne(@Param('id') id: string, @RequestUser() user: User) {
    return this.postsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard, PostRoleGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: '게시글 수정',
    description: '게시글을 수정합니다.',
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard, PostRoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: '게시글을 삭제합니다.',
  })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
