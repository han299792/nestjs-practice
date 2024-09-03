import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
  prismaService: any;
  async upsertRefreshToken(userId: number, refreshToken: string) {
    return this.prismaService.refreshToken
      .upsert({
        where: { userId },
        update: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          userId,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'p2002') {
            throw new ConflictException('Unique constraint failed');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }
  async deleteRefreshToken(userId: number) {
    return this.prismaService.refreshToken
      .delete({ where: { userId } })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2013') {
            throw new ConflictException('존재하지 않는 유저');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }
  async findUserByName(username: string): Promise<User> {
    const user = await this.prismaService.user
      .findUnique({
        where: { username: username },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2013') {
            throw new ConflictException('존재하지 않는 유저');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
    return user;
  }
}
