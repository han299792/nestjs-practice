import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '태그' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
export class UpdatePostDto {
  @ApiProperty({ description: '제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '내용' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '태그' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
