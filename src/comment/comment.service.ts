import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Comments from './entities/comment.entity';
import { Repository } from 'typeorm';
import Posts from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Posts)
    private readonly PostsRepository: Repository<Posts>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const post = await this.PostsRepository.findOne({
      where: {
        id: parseInt(createCommentDto.postId),
      },
    });

    if (!post) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    const comment = this.commentsRepository.create(createCommentDto);
    this.commentsRepository.save(comment);
    return {
      ...comment,
      status: 'success',
      message: 'بازخورد شما با موفقیت ارسال شد.',
    };
  }

  findAll() {
    return this.commentsRepository.find({
      relations: {
        post: true,
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) {
      throw new HttpException('comment not found.', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) {
      throw new HttpException('comment not found.', HttpStatus.NOT_FOUND);
    }

    const data = await this.commentsRepository.update(
      { id },
      { ...updateCommentDto },
    );

    return {
      ...data,
      status: 'success',
      message: 'تغییرات با موفقیت لحاظ شد.',
    };
  }
}
