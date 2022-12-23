import { Injectable, PipeTransform, ArgumentMetadata, HttpException } from "@nestjs/common"
import { CommentsService } from "src/comments/comments.service"
import { PostsService } from "src/posts/posts.service"
import { HTTP_STATUSES } from "../types/types"

//pipe проверки существования comment по id
//аналог middlewares
//вроде попроще чем Decorator
@Injectable()
export class PostIdValidatorPipe implements PipeTransform {

    constructor(private postsService: PostsService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        //если value это параметр с названием "id"
        if (metadata.type === 'param' && metadata.data === 'id') {
            const postId = value
            const post = await this.postsService.readOne(postId)
            if (!post) throw new HttpException([{ message: "post not found", field: "id" }], HTTP_STATUSES.NOT_FOUND_404)
        }
        return value
    }
}