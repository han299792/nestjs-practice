// user.repository.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, email: string, password: string) {
    return this.prisma.user
      .create({
        data: {
          username,
          email,
          password,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'p2002') {
            throw new ConflictException('이미 계정이 존재합니다.');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany().catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2013') {
          throw new ConflictException('존재하지 않는 유저');
        }
      }
      throw new InternalServerErrorException('unknown error');
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    return this.prisma.user
      .findUnique({
        where: { id: Number(userId) },
        include: {
          refreshToken: true,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2013') {
            throw new ConflictException('존재하지 않는 유저');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }
}
