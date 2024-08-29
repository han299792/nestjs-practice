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
import { CustomRequest } from 'src/types/auth.type';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post('/')
  async createPost(
    @Req() req: CustomRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    const userId = req.user.userId;
    return this.postService.createPost(userId, createPostDto);
  }

  @Get()
  async getPosts() {
    return this.postService.getPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Get('search')
  async searchPosts(@Query('keyword') keyword: string) {
    return this.postService.searchPosts(keyword);
  }

  @Get('tag/:tag')
  async getPostByTag(@Param('tag') tag: string) {
    return this.postService.getPostsByTag(tag);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch(':id')
  async updatePost(
    @Req() req: CustomRequest,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = req.user.userId;
    return this.postService.updatePost(userId, id, updatePostDto);
  }
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async deletePost(@Req() req: CustomRequest, @Param('id') id: number) {
    const userId = req.user.userId;
    return this.postService.deletePost(userId, id);
  }
}
