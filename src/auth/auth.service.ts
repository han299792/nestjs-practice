import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}
  //로그인
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = this.authRepository.findUserByName(username);
    //비밀번호 db에서 꺼내와서 비교
    if (!user || !(await bcrypt.compare(password, (await user).password))) {
      throw new Error('비밀번호가 다릅니다.');
    }
    //토큰 발급
    const payload = { userId: (await user).id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
    });
    //configService 를 사용
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'),
    });
    //DB에 저장
    await this.authRepository.upsertRefreshToken((await user).id, refreshToken);
    return { accessToken, refreshToken };
  }
  //로그아웃
  async logout(userId: number) {
    await this.authRepository.deleteRefreshToken(userId);
  }

  //저장된 refresh 토큰과 비교하는 로직
  async compareUserRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userService.getUserById(userId);
    if (!user.refreshToken) return false;

    if (refreshToken === user.refreshToken[0].token) {
      return true;
    } else {
      return false;
    }
  }
  //refresh 토큰으로 access 토큰 재발급 받는 로직
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.userService.getUserById(payload.userId);
      // 유저 정보가 없거나 refresh토큰이 다를 때 에러처리
      if (
        !user ||
        !(await this.compareUserRefreshToken(user.id, refreshToken))
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { userId: user.id, username: user.username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: parseInt(
            this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
          ),
        },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
