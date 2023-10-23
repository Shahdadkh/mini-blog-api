import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Posts from './entities/post.entity';
import Users from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Users])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
