import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Posts from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    this.postsRepository.save(post);
    return post;
  }

  findAll() {
    return this.postsRepository.find();
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

    return this.postsRepository.update({ id }, { ...updatePostDto });
  }

  async remove(id: number) {
    const postId = await this.postsRepository.findOne({ where: { id } });

    if (!postId) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    return this.postsRepository.delete(id);
  }
}
