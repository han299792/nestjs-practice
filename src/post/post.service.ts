import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    const { title, content, tags } = createPostDto;
    return this.prisma.post.create({
      data: {
        title,
        content,
        tags,
        author: { connect: { id: userId } },
      },
    });
  }

  async getPosts() {
    return this.prisma.post.findMany({
      include: { author: true },
    });
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    return post;
  }

  async searchPosts(keyword: string) {
    return this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      include: { author: true },
    });
  }

  async getPostsByTag(tag: string) {
    return this.prisma.post.findMany({
      where: {
        tags: { has: tag },
      },
      include: { author: true },
    });
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.getPostById(postId);
    if (post.authorId !== userId) {
      throw new ForbiddenException('접근권한이 없습니다.');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: updatePostDto,
    });
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.getPostById(postId);
    if (post.authorId !== userId) {
      throw new ForbiddenException('접근권한이 없습니다.');
    }

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
