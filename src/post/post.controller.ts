import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post('/')
  async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const userId = await this.postService.extractUserIdFromToken(req);
    return this.postService.createPost(userId, createPostDto);
  }

  @Get()
  async getPosts() {
    return this.postService.getPosts();
  }
  @Get('search')
  async searchPosts(@Query('keyword') keyword: string) {
    return this.postService.searchPosts(keyword);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const numberedId = Number(id);
    return this.postService.getPostById(numberedId);
  }

  @Get('tag/:tag')
  async getPostByTag(@Param('tag') tag: string) {
    return this.postService.getPostsByTag(tag);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch(':id')
  async updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = await this.postService.extractUserIdFromToken(req);
    const numberedId = Number(id);
    return this.postService.updatePost(userId, numberedId, updatePostDto);
  }
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async deletePost(@Req() req: Request, @Param('id') id: number) {
    const userId = await this.postService.extractUserIdFromToken(req);
    const numberedId = Number(id);
    return this.postService.deletePost(userId, numberedId);
  }
}
