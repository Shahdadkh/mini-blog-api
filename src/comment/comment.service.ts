import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Comments from './entities/comment.entity';
import { Repository } from 'typeorm';
import Posts from 'src/post/entities/post.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Posts)
    private readonly PostsRepository: Repository<Posts>
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const post = await this.PostsRepository.findOne({
      where: {
        uuid: createCommentDto.postUuid
      }
    });

    if (!post) {
      throw new HttpException('post not found.', HttpStatus.NOT_FOUND);
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId: post.id.toString(),
      uuid: uuidv4()
    });
    this.commentsRepository.save(comment);

    return {
      ...comment,
      status: 'success',
      message: 'بازخورد شما با موفقیت ارسال شد.'
    };
  }

  findAll() {
    return this.commentsRepository.find({
      relations: {
        post: true
      }
    });
  }

  async findOne(id: string) {
    const comment = await this.commentsRepository.findOne({
      where: { uuid: id },
      relations: {
        post: true
      }
    });

    if (!comment) {
      throw new HttpException('comment not found.', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({
      where: { uuid: id }
    });

    if (!comment) {
      throw new HttpException('comment not found.', HttpStatus.NOT_FOUND);
    }

    const data = await this.commentsRepository.update(
      { uuid: id },
      { ...updateCommentDto }
    );

    return {
      ...data,
      status: 'success',
      message: 'تغییرات با موفقیت لحاظ شد.'
    };
  }
}
