// post.repository.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    const { title, content, tags } = createPostDto;
    return this.prismaService.post
      .create({
        data: {
          title,
          content,
          tags,
          author: { connect: { id: userId } },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'p2002') {
            throw new ConflictException('중복게시물');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async getPosts() {
    return this.prismaService.post
      .findMany({
        include: { author: true },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2013') {
            throw new ConflictException('존재하지 않는 게시물');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async getPostById(id: number) {
    return this.prismaService.post
      .findUnique({
        where: { id },
        include: { author: true },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2013') {
            throw new ConflictException('게시물 정보가 존재하지 않음');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async searchPosts(keyword: string) {
    return this.prismaService.post
      .findMany({
        where: {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        },
        include: { author: true },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P1001') {
            throw new ConflictException('Database connection error');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async getPostsByTag(tag: string) {
    return this.prismaService.post
      .findMany({
        where: {
          tags: { has: tag },
        },
        include: { author: true },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P1001') {
            throw new ConflictException('Database connection error');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) {
    return this.prismaService.post
      .update({
        where: { id: postId },
        data: updatePostDto,
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2025') {
            throw new ConflictException('Record to update not found');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }
  async deletePost(postId: number) {
    return this.prismaService.post
      .delete({
        where: { id: postId },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2025') {
            throw new ConflictException('Record to update not found');
          }
        }
        throw new InternalServerErrorException('unknown error');
      });
  }
}
