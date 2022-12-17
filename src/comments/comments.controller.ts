import { Controller, Get, Body, Post, Param, Query, Res, Delete, HttpCode, UsePipes } from '@nestjs/common';
import { CommentIdValidatorPipe } from 'src/_commons/pipes/commentId.validation.pipe';
import { readCommentByIdDto, } from './comment.model';
import { CommentsService } from './comments.service';


@Controller('comments')
export class CommentsController {
    constructor(
        private postService: CommentsService,
        private CommentIdValidator: CommentIdValidatorPipe
    ) { }

    @Get(':id/:ob')
    @UsePipes(CommentIdValidatorPipe)
    async readOneComment(@Param("id") commentId: string) {
        //readCommentByIdDto
        return await this.postService.findOne(commentId)
    }
}
