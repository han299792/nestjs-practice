import { IsInt, IsString } from 'class-validator';

export class LoginDto {
  @IsInt()
  userId: number;
  @IsString()
  password: string;
}
