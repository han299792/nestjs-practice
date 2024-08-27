import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  prisma = new PrismaClient();
  //로그인
  async login(loginDto: LoginDto) {
    const { userId, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    //비밀번호 db에서 꺼내와서 비교
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('비밀번호가 다릅니다.');
    }
    const payload: { userId: number } = { userId: user.id }; // 타입 추론이 가능하게 바꿀 것
    //토큰 발급
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    //DB에 저장
    await this.prisma.accessToken.create({
      data: {
        token: accessToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        userId: user.id,
      },
    });
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userId: user.id,
      },
    });

    return { accessToken, refreshToken };
  }
  //로그아웃
  async logout(refreshToken: string) {
    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  }
}
