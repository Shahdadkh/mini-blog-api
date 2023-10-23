import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Posts from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.UsersRepository.findOne({
      where: {
        id: parseInt(createPostDto.userId),
      },
    });

    if (!user) {
      throw new HttpException('user not found.', HttpStatus.NOT_FOUND);
    }

    const post = this.postsRepository.create(createPostDto);
    this.postsRepository.save(post);
    return {
      ...post,
      status: 'success',
      message: 'پست با موفقیت ایجاد شد.',
    };
  }

  findAll() {
    return this.postsRepository.find({
      relations: {
        user: true,
        comments: true,
      },
    });
  }

  async findOne(id: number) {
    const postId = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        comments: true,
      },
    });

    if (!postId) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    return postId;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const postId = await this.postsRepository.findOne({ where: { id } });

    if (!postId) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    const update = await this.postsRepository.update(
      { id },
      { ...updatePostDto },
    );
    return {
      ...update,
      status: 'success',
      message: 'تغییرات با موفقیت لحاظ شد.',
    };
  }

  async remove(id: number) {
    const postId = await this.postsRepository.findOne({ where: { id } });

    if (!postId) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    const data = await this.postsRepository.delete(id);
    return {
      ...data,
      status: 'success',
      message: 'پست با موفقیت حذف شد',
    };
  }
}
