import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import Comments from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Posts from 'src/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Posts])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
