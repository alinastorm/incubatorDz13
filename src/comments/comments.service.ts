import { CommentBdDocument, CommentSchema } from "./comment.module";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";



@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private CommentModel: Model<CommentBdDocument>,
    ) { }
    async findOne(userId) {

        CommentSchema.virtual('myStatus', { ref: 'Likes', localField: '_id', foreignField: 'commentId', options: { match: { userId: userId } } })//TODO всунуть в метод .Метод в модель и вызывать создание виртуальных полей. 
        return await this.CommentModel.findOne().populate('myStatus', 'myStatus')
    }
}