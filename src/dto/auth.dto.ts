import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '사용자 id' })
  @IsInt()
  username: string;
  @ApiProperty({ description: '사용자 비밀번호' })
  @IsString()
  password: string;
}
