import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user, createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(req.user, id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.postService.remove(req.user, id);
  }
}
