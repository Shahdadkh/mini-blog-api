import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  @IsOptional()
  aboutMe: string;

  @IsString()
  @IsOptional()
  facebook: string;

  @IsString()
  @IsOptional()
  twitter: string;

  @IsString()
  @IsOptional()
  telegram: string;

  @IsString()
  @IsOptional()
  instagram: string;
}
