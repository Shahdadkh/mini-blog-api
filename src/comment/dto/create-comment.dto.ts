import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
