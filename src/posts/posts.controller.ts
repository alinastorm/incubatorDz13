import { Controller, Get, Body, Post, Put, Param, Query, Res, Delete, HttpCode, UsePipes } from '@nestjs/common';
import { CommentsService } from 'src/comments/comments.service';
import { PostIdValidatorPipe } from 'src/_commons/pipes/postId.validation.pipe';
import { PaginatorQueries } from 'src/_commons/types/types';
import { PostInput, PostInputUpdateDto } from './post.model';
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService, private commentsService: CommentsService) { }

    @Get(":postId/comments")
    readAllCommentsfromPost(
        @Param("postId") postId: string,
        @Query() queries: PaginatorQueries) {
        return this.commentsService.readAllByPostIdWithPagination(postId, queries)
    }

    @Get()
    readAllPosts(queries: PaginatorQueries) {
        return this.postService.readAllWithPaginator(queries)
    }

    @Post()
    addOnePost(
        @Body() post: PostInput,
    ) {
        return this.postService.addOne(post)
    }

    @Get(":id")
    readOnePost(
        @Param('id') postId: string
    ) {
        return this.postService.readOne(postId)
    }

    @Put(":id") @UsePipes(PostIdValidatorPipe) @HttpCode(204)
    updateOnePost(
        @Param('id') postId: string,
        @Body() postUpdates: PostInputUpdateDto
    ) {
        this.postService.updateOne(postId, postUpdates)
    }

    @Delete(":id") @UsePipes(PostIdValidatorPipe) @HttpCode(204)
    deleteOnePost(
        @Param() postId: string
    ) {
        this.postService.deleteOnePost(postId)
    }

}
