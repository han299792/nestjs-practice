import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request.cookies?.refresh_token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { userId: number }) {
    const refreshToken = req?.cookies?.refresh_token;

    const userId = payload.userId;

    if (!refreshToken) {
      throw new UnauthorizedException('refresh token is undefined');
    }

    // 저장된 refresh token과 비교
    const result = await this.authService.compareUserRefreshToken(
      userId,
      refreshToken,
    );
    // 결과가 틀렸다면 예외 발생
    if (!result) {
      throw new UnauthorizedException('refresh token is wrong');
    }

    return userId;
  }
}
