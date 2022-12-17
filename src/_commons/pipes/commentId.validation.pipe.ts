import { Injectable, PipeTransform, ArgumentMetadata, HttpException } from "@nestjs/common"
import { CommentsService } from "src/comments/comments.service"
import { HTTP_STATUSES } from "../types/types"


@Injectable()
export class CommentIdValidatorPipe implements PipeTransform {

    constructor(private commentService: CommentsService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param' && metadata.data === 'id') {
            const commentId = value
            const comment = await this.commentService.findOne(commentId)
            if (!comment) throw new HttpException([{ message: "comment not found1", field: "id" }], HTTP_STATUSES.BAD_REQUEST_400)
        }
        return value
    }
}