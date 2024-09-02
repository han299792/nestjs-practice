import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { AuthController } from './auth/auth.controller';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenGuard } from './auth/guard/accessToken.guard';
import { JwtRefreshTokenGuard } from './auth/guard/refreshToken.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
    PassportModule.register({}),
  ],
  controllers: [AppController, UserController, AuthController, PostController],
  providers: [
    AppService,
    UserService,
    PostService,
    AuthService,
    ConfigService,
    PrismaService,
    JwtAccessTokenGuard,
    JwtRefreshTokenGuard,
  ],
})
export class AppModule {}
