import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ListAllPostsDto, OrderByOption, Order } from './dto/list-all-post.dto';
import { PostView } from './entities/post-view.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = this.postRepository.create({
      ...createPostDto,
      user,
    });
    return await this.postRepository.save(post);
  }

  async findAll(options: ListAllPostsDto) {
    // const { limit, offset, title, content, userId } = options;
    // const whereCondition: FindOptionsWhere<Post>[] = [];
    // if (title) {
    //   whereCondition.push({ title: ILike(`%${title}%`) });
    // }
    // if (content) {
    //   whereCondition.push({ content: ILike(`%${content}%`) });
    // }
    // if (userId) {
    //   whereCondition.push({ user: { id: userId } });
    // }
    // const [data, total] = await this.postRepository.findAndCount({
    //   relations: ['user'],
    //   where: whereCondition.length > 0 ? whereCondition : undefined,
    //   take: limit,
    //   skip: limit * (offset - 1),
    //   // select: {
    //   //   content: false,
    //   //   user: {
    //   //     id: true,
    //   //     name: true,
    //   //     email: true,
    //   //   },
    //   // },
    // });
    // return {
    //   data,
    //   total,
    //   limit,
    //   offset,
    //   totalPages: Math.ceil(total / limit),
    // };
    const { limit, offset, title, content, userId, orderBy, order } = options;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .take(limit)
      .skip(limit * (offset - 1))
      // .orderBy('post.createdAt', 'DESC')
      .select([
        'post.id',
        'post.title',
        'post.thumbnailUrl',
        'post.createdAt',
        'user.id',
        'user.name',
        'user.email',
      ]);

    if (title) {
      queryBuilder.andWhere('post.title LIKE :title', {
        title: `%${title}%`,
      });
    }
    if (content) {
      queryBuilder.andWhere('post.content LIKE :content', {
        content: `%${content}%`,
      });
    }
    if (userId) {
      queryBuilder.andWhere('post.userId = :userId', {
        userId,
      });
    }
    if (
      orderBy &&
      [OrderByOption.VIEW_COUNT, OrderByOption.CREATED_AT].includes(orderBy)
    ) {
      queryBuilder.orderBy(`post.${orderBy}`, order);
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

  async findOne(id: string, user: User) {
    const data = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!data) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    if (data.user.id !== user.id) {
      throw new ForbiddenException('게시글을 조회할 권한이 없습니다.');
    }
    if (data) {
      const checkPostView = await this.postViewRepository.findOne({
        where: { post: { id: data.id }, user: { id: user.id } },
        order: { createdAt: Order.DESC },
      });

      if (checkPostView && checkPostView.createdAt) {
        const timeDiff = Date.now() - checkPostView.createdAt.getTime();
        if (timeDiff <= 1000 * 60 * 10) {
          return data;
        }
      }
      const postView = this.postViewRepository.create({
        post: data,
        user,
      });
      await this.postViewRepository.save(postView);
      // const postViewCount = await this.postViewRepository.count({
      //   where: { post: { id: data.id } },
      // });
      // data.viewCount = postViewCount;
      // await this.postRepository.save(data);
    }
    return data;
  }

  async findPostById(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string) {
    return this.postRepository.delete(id);
  }
}
