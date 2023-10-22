import { IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  verify: boolean;

  @IsOptional()
  answer: string;
}
