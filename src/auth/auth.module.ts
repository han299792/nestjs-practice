import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAccessTokenStrategy } from './strategy/accessToken.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
        },
      }),
    }),
    PrismaModule,
    ConfigModule,
  ],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    JwtService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    ConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
