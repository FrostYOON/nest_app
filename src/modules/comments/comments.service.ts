import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import {
  ListAllCommentsDto,
  OrderByOption,
  CommentLikeType,
} from './dto/list-all-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
    postId: string,
  ) {
    const { content } = createCommentDto;
    const post = await this.postsService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const commentData = this.commentRepository.create({
      content,
      post,
      user,
      likeCount: 0,
      dislikeCount: 0,
    });

    return await this.commentRepository.save(commentData);
  }

  async createReply(
    createCommentDto: CreateCommentDto,
    postId: string,
    commentId: string,
    user: User,
  ) {
    const { content } = createCommentDto;
    const post = await this.postsService.findPostById(postId);
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    const parent = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!parent) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const reply = this.commentRepository.create({
      content,
      post,
      user,
      parent,
      likeCount: 0,
      dislikeCount: 0,
    });

    return await this.commentRepository.save(reply);
  }

  async findCommentsByPostId(limit: number, postId: string) {
    // const comments = await this.commentRepository.find({
    //   where: { post: { id: postId } },
    //   relations: ['user', 'post', 'parent', 'children'],
    //   take: limit,
    //   select: {
    //     id: true,
    //     content: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     likeCount: true,
    //     dislikeCount: true,
    //     parent: IsNull(),
    //     user: {
    //       id: true,
    //       name: true,
    //       email: true,
    //     },
    //     post: {
    //       id: true,
    //       title: true,
    //       content: true,
    //     },
    //   },
    // });

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.children', 'children')
      .where('post.id = :postId', { postId })
      .andWhere('comment.parentId IS NULL')
      .take(limit)
      .select([
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'comment.likeCount',
        'comment.dislikeCount',
        'user.id',
        'user.name',
        'user.email',
        'post.id',
        'post.title',
        'post.content',
        'parent.id',
        'parent.content',
        'children.id',
        'children.content',
        'children.createdAt',
        'children.updatedAt',
        'children.likeCount',
        'children.dislikeCount',
      ])
      .getMany();

    return comments;
  }

  async findComments(options: ListAllCommentsDto, postId: string) {
    const { limit, offset, parentId, userId, content, orderBy, order } =
      options;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .take(limit)
      .skip(limit * (offset - 1))
      .select([
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'comment.likeCount',
        'comment.dislikeCount',
        'comment.parentId',
        'post.id',
        'post.title',
        'post.content',
        'user.id',
        'user.name',
        'user.email',
      ]);

    if (postId) {
      queryBuilder.andWhere('post.id = :postId', { postId });
    }
    if (parentId) {
      queryBuilder.andWhere('comment.parentId = :parentId', { parentId });
    }
    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }
    if (content) {
      queryBuilder.andWhere('comment.content LIKE :content', { content });
    }
    if (orderBy && [OrderByOption.CREATED_AT].includes(orderBy)) {
      queryBuilder.orderBy(`comment.${orderBy}`, order);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(commentId: string, user: User) {
    const data = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'post', 'parent', 'children'],
    });
    if (!data) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (data.user.id !== user.id) {
      throw new ForbiddenException('댓글을 조회할 권한이 없습니다.');
    }

    return data;
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
    // const comment = await this.commentRepository.findOne({
    //   where: { id: commentId },
    // });
    // if (!comment) {
    //   throw new NotFoundException('댓글을 찾을 수 없습니다.');
    // }

    // comment.content = updateCommentDto.content;

    // return await this.commentRepository.save(comment);

    const result = await this.commentRepository.update(
      commentId,
      updateCommentDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return {
      message: '댓글이 수정되었습니다.',
      updatedComment: updateCommentDto,
      result,
    };
  }

  async removeComment(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post', 'children'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const result = await this.commentRepository.remove(comment);

    return {
      message: '댓글이 삭제되었습니다.',
      result,
    };
  }

  async likeComment(commentId: string, type: CommentLikeType) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    if (type === CommentLikeType.LIKE) {
      comment.likeCount++;
    } else if (type === CommentLikeType.DISLIKE) {
      comment.dislikeCount++;
    }
    return this.commentRepository.save(comment);
  }
}
