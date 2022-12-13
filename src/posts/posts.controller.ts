import { Controller, Get, Body, Post, Put, Param, Query, Res, Delete, HttpCode } from '@nestjs/common';
import { PaginatorQueries } from 'src/_commons/types/types';
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {

    constructor(protected postService: PostsService) { }

    @Get(":postId/comments")
    readAllCommentsfromPost() {
        
     }
    @Get()
    readAllPosts(queries: PaginatorQueries) {
        return this.postService.readAllPostsWithPaginator(queries)
    }
    @Post()
    addOnePost() { }
    @Get(":id")
    readOnePost() { }
    @Put(":id")
    updateOnePost() { }
    @Delete(":id")
    deleteOnePost() { }

}
