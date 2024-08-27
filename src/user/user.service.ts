import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async registerUser(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return user;
  }
  //모든 user 정보 리스트 가져오기
  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
  //  id로 유저 정보 받아오기
  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        refreshToken: true,
      },
    });
  }
}
