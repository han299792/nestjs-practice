import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth.dto';
import { Response } from 'express';
import { CustomRequest } from 'src/types/auth.type';
import { JwtRefreshTokenGuard } from './guard/refreshToken.guard';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, //15분
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return res.json({ message: '로그인 성공' });
  }

  @Post('logout')
  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const userId = req.user.userId;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    await this.authService.logout(userId);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.json({ message: '로그아웃 성공' });
  }

  @UseGuards(JwtRefreshTokenGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    // 새로운 액세스 토큰을 쿠키에 저장
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15분
    });

    return res.json({ accessToken });
  }
}
