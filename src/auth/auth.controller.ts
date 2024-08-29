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
import { Request, Response } from 'express';
import { JwtRefreshTokenGuard } from './guard/refreshToken.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { refreshToken } = await this.authService.login(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return res.json({ message: '로그인 성공' });
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const userId = payload.userId;

    await this.authService.logout(userId);

    res.clearCookie('refresh_token');

    return res.json({ message: '로그아웃 성공' });
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    return res.json({ accessToken });
  }
}
