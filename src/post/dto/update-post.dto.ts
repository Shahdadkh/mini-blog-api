import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  verify: boolean;
}
