import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { LikeStatus } from "./like.model";
import { Comment, CommentBdDocument, CommentSchema, CommentViewDataMapper, LikesInfoView } from "./comment.model";
import { Post, PostBdDocument } from 'src/posts/post.model';
import { User, UserBdDocument } from 'src/users/user.model';
import { HTTP_STATUSES } from 'src/_commons/types/types';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private CommentModel: Model<CommentBdDocument>,
        @InjectModel(Post.name) private PostModel: Model<PostBdDocument>,
        @InjectModel(User.name) private UserModel: Model<UserBdDocument>,
    ) { }
    async findOne(userId: string) {
        CommentSchema.virtual('likesInfo.myStatus', { ref: 'Likes', localField: '_id', foreignField: 'commentId', options: { match: { userId: userId } } })//TODO всунуть в метод .Метод в модель и вызывать создание виртуальных полей. 
            .get(function () { return LikeStatus.None })
        return await this.CommentModel.findOne().populate('likesInfo.myStatus', 'myStatus')
    }
    async createOne(postId: string, userId: string, content: string) {
        const post = await this.PostModel.findById(postId)
        if (!post) throw new HttpException([{ message: "no post", field: "postId" }], HTTP_STATUSES.NOT_FOUND_404)

        const user = await this.UserModel.findById(userId)
        if (!user) throw new HttpException([{ message: "no userId", field: "userId" }], HTTP_STATUSES.UNAUTHORIZED_401)

        const { login: userLogin } = user
        const createdAt = new Date().toISOString()

        const likesInfo: LikesInfoView = { dislikesCount: 0, likesCount: 0, myStatus: LikeStatus.None }
        const element: Comment = { content, userId, userLogin, createdAt, postId, likesInfo }
        const idComment: string = (await this.CommentModel.create(element))._id.toString()
        {
            const comment = await this.CommentModel.findById(idComment).then(CommentViewDataMapper)
            if (!comment) throw new HttpException([{ message: "no post", field: "postId" }], HTTP_STATUSES.NOT_FOUND_404)
            return comment
        }
    }
}

