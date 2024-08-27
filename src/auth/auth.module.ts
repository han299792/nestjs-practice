import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UserModule, PassportModule, JwtModule],
  providers: [AuthService, UserService, PrismaService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
