import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  date: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  verify: boolean;

  @IsOptional()
  comments: string;
}
