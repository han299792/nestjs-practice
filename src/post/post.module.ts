import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAccessTokenStrategy } from 'src/auth/strategy/accessToken.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access_token' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
    ConfigModule,
    PrismaModule,
    UserModule,
  ],
  providers: [PostService, PrismaService, JwtService, JwtAccessTokenStrategy],
  controllers: [PostController],
})
export class PostModule {}
