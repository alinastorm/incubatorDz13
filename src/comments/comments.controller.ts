import { Controller, Get, Body, Post, Param, Query, Res, Delete, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';


@Controller('comments')
export class CommentsController {
    constructor(private postService: CommentsService) { }

    @Get()
    async readOneComment(@Param('userId') userId: string) {
        return await this.postService.findOne(userId)
    }
}
