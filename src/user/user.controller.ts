import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { UserPublicDto } from 'src/types/auth.type';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.registerUser(username, email, password);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(
    @Param('id') userId: number,
  ): Promise<UserPublicDto | string> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      return '사용자가 없습니다.';
    }
    const publicUser: UserPublicDto = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return publicUser;
  }
}
