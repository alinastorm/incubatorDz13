import { Document,HydratedDocument, ObjectId } from "mongoose"
import { LikeStatus } from "src/likes/like.model"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//Types
export interface PostInput {
    title: string//    maxLength: 30
    shortDescription: string//    maxLength: 100
    content: string//maxLength: 1000
    blogId: string
}
export interface PostBd {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string//TODO в дз не обязательный в интерфей
    extendedLikesInfo: ExtendedLikesInfoBd
}
export interface PostView {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string//TODO в дз не обязательный в интерфей
    extendedLikesInfo: ExtendedLikesInfoView
}
export interface ExtendedLikesInfoBd {
    /** Likes */
    likes: LikeDetails[],
    /** Deslike */
    deslike: LikeDetails[]
}
export interface VirtualFieldsPost {
    /** Virtual field */
    dislikesCount: number
    /** Virtual field */
    likesCount: number
    /** Virtual field */
    myStatus: LikeStatus
    /** Virtual field */
    newestLikes: LikeDetails[] | []
}
export interface ExtendedLikesInfoView {
    /** Total likes for parent item */
    /** Virtual prop Mongoose*/
    likesCount: number //	integer($int32) 
    /** Total dislikes for parent item */
    /** Virtual prop Mongoose*/
    dislikesCount: number //	integer($int32) 
    /** Send None if you want to unlike\undislike */
    /** Virtual prop Mongoose*/
    myStatus: LikeStatus //string Enum: Array[3]    
    /** Last 3 likes (status "Like") */
    /** Virtual prop Mongoose*/
    newestLikes: LikeDetails[] | []
}
export interface LikeDetails {
    /** Details about single like*/
    addedAt: string //	string($date - time)
    userId: string //	string    nullable: true,
    login: string //	string    nullable: true}
}

// export type PostBdDocument = Document<unknown, any, Post> & Post & Required<{
//     _id: string;
// }>
export type PostBdDocument = HydratedDocument<Post>;
export type PostViewDocument = HydratedDocument<PostView>;

@Schema({ versionKey: false })
export class LikeDetails implements LikeDetails {
    @Prop() addedAt: string //	string($date - time)
    @Prop() userId: string //	string    nullable: true,
    @Prop() login: string //	string    nullable: true} 
}
@Schema({ versionKey: false })
export class ExtendedLikesInfo implements ExtendedLikesInfoBd, VirtualFieldsPost {

    /** Likes */
    @Prop() likes: LikeDetails[]
    /** Deslike */
    @Prop() deslike: LikeDetails[]
    /** Virtual field */
    @Prop() dislikesCount: number
    /** Virtual field */
    @Prop() likesCount: number
    /** Virtual field */
    @Prop() myStatus: LikeStatus
    /** Virtual field */
    @Prop() newestLikes: LikeDetails[] | []
}
export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);
ExtendedLikesInfoSchema.virtual('likesCount').get(function (this: ExtendedLikesInfo) {
    return this.likes.length;
});
ExtendedLikesInfoSchema.virtual('dislikesCount').get(function (this: ExtendedLikesInfo) {
    return this.deslike.length;
});
ExtendedLikesInfoSchema.virtual('newestLikes').get(function (this: ExtendedLikesInfo) {
    return this.likes.slice(0, 3);
});
@Schema({ versionKey: false })
export class Post implements PostBd {

    @Prop() _id: ObjectId
    @Prop() title: string
    @Prop() shortDescription: string
    @Prop() content: string
    @Prop() blogId: string
    @Prop() blogName: string
    @Prop() createdAt: string//TODO в дз не обязательный в интерфей
    @Prop({ type: ExtendedLikesInfoSchema, default: () => ({}) })
    extendedLikesInfo: ExtendedLikesInfo
}

export const PostSchema = SchemaFactory.createForClass(Post);

export function postViewDataMapper(value: PostBdDocument | null): PostView | null {
    return value ?
        {
            id: value._id.toString(), //?? value.id,//value.id так как пихаю в старый модуль repository а он мапит _id=>id 
            title: value.title,
            shortDescription: value.shortDescription,
            content: value.content,
            blogId: value.blogId,
            blogName: value.blogName,
            createdAt: value.createdAt,//TODO в дз не обязательный в интерфей
            extendedLikesInfo: {
                dislikesCount: value.extendedLikesInfo.dislikesCount,
                likesCount: value.extendedLikesInfo.likesCount,
                myStatus: value.extendedLikesInfo.myStatus,
                newestLikes: value.extendedLikesInfo.newestLikes,
            },
        } : null
}