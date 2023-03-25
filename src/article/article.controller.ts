import {Controller, Get, Post, Put, Delete, UseGuards, Body, Param, UsePipes, ValidationPipe} from '@nestjs/common'
import { ArticleService } from './article.service'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { User } from '@app/user/decorators/user.decorator'
import { UserEntity } from '@app/user/user.entity'
import { CreateArticleDto } from './dto/createArticle.dto'
import { ArticleResponseInterface } from './types/articleResponse.interface'

@Controller('articles')
export class ArticleController {
  constructor (private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(currentUser, createArticleDto);
    return this.articleService.buildArticleResponse(article)
  }

  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug)
    return this.articleService.buildArticleResponse(article)
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number, 
    @Param('slug') slug: string, 
    @Body('article') updateArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(slug, updateArticleDto, currentUserId)
    return this.articleService.buildArticleResponse(article)
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug, currentUserId)
  }
}