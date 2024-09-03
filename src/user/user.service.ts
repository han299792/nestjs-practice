// user.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(username, email, hashedPassword);
    return '회원가입 성공';
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.findUserById(userId);
  }
}
