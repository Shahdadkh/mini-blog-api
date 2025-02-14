import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Posts from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserInterface } from 'src/user/interface/user.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}

  async create(userInfo: UserInterface, createPostDto: CreatePostDto) {
    //Find User
    const user = await this.UsersRepository.findOne({
      where: {
        uuid: createPostDto.userUuid,
      },
    });

    if (!user) {
      throw new HttpException('user not found.', HttpStatus.NOT_FOUND);
    }

    //Checking User
    if (userInfo.role !== 'admin' && userInfo.sub !== user.uuid) {
      throw new HttpException('You are not allowed.', HttpStatus.FORBIDDEN);
    }

    //Handle Data
    const post = this.postsRepository.create({
      uuid: uuidv4(),
      userId: user.id.toString(),
      ...createPostDto,
    });
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

  async findOne(id: string) {
    const postId = await this.postsRepository.findOne({
      where: { uuid: id },
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

  async update(
    userInfo: UserInterface,
    id: string,
    updatePostDto: UpdatePostDto,
  ) {
    //Find Post
    const postId = await this.postsRepository.findOne({ where: { uuid: id } });

    if (!postId) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    //Checking User
    if (userInfo.role !== 'admin' && userInfo.sub !== postId.userUuid) {
      throw new HttpException('You are not allowed.', HttpStatus.FORBIDDEN);
    }

    //Handle Data
    const update = await this.postsRepository.update(
      { uuid: id },
      { ...updatePostDto },
    );
    return {
      ...update,
      status: 'success',
      message: 'تغییرات با موفقیت لحاظ شد.',
    };
  }

  async remove(userInfo: UserInterface, id: string) {
    //Find Post
    const postId = await this.postsRepository.findOne({ where: { uuid: id } });

    if (!postId) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    //Checking User
    if (userInfo.role !== 'admin' && userInfo.sub !== postId.userUuid) {
      throw new HttpException('You are not allowed.', HttpStatus.FORBIDDEN);
    }

    //Handle Data
    const data = await this.postsRepository.delete({ uuid: id });
    return {
      ...data,
      status: 'success',
      message: 'پست با موفقیت حذف شد',
    };
  }
}
