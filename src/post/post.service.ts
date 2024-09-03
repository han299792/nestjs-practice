import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly configService: ConfigService,
    private readonly postRepository: PostRepository,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    return this.postRepository.createPost(userId, createPostDto);
  }

  async getPosts() {
    return this.postRepository.getPosts();
  }

  async getPostById(id: number) {
    const post = await this.postRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    return post;
  }

  async searchPosts(keyword: string) {
    return this.postRepository.searchPosts(keyword);
  }

  async getPostsByTag(tag: string) {
    return this.postRepository.getPostsByTag(tag);
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
    return this.postRepository.updatePost(postId, updatePostDto);
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.getPostById(postId);
    if (post.authorId !== userId) {
      throw new ForbiddenException('접근권한이 없습니다.');
    }
    return this.postRepository.deletePost(postId);
  }

  async extractUserIdFromToken(req: Request): Promise<number | null> {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        return null;
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        return null;
      }

      const decoded = jwt.verify(
        token,
        this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      ) as { userId: number };

      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}
