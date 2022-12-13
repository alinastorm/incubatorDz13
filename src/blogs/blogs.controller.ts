import { Controller, Get, Body, Post, Put, Param, Query, Delete, HttpCode } from '@nestjs/common';
import { PostView } from 'src/posts/post.model';
import { Paginator, PaginatorQueries } from 'src/_commons/types/types';
import { BlogInput, BlogView } from './blog.model';
import { BlogsService } from './blogs.service';


@Controller('blogs')
export class BlogsController {
    constructor(protected blogService: BlogsService) { }

    @Get()
    readAllBlogsWithPaginator(@Query() queries: PaginatorQueries): Promise<Paginator<BlogView>> {
        return this.blogService.readAllBlogsWithPaginator(queries)
    }
    @Post()
    addOneBlog(@Body() body: BlogInput): Promise<BlogView> {
        return this.blogService.addOneBlog(body)
    }
    @Get(":blogId/posts")
    readAllPostsFromBlog(
        @Param('blogId') blogId: string,
        @Query() queries: PaginatorQueries
    ): Promise<Paginator<PostView>> {
        return this.blogService.readAllPostsFromBlog(blogId, queries)
    }
    @Post()
    addPostToBlog() { }
    @Get()
    readOneBlog() { }
    @Put()
    updateOneBlog() { }
    @Delete()
    deleteOneBlog() { }
}
