import { ObjectId } from "mongoose"

export interface LikeInputModel {
    likeStatus: LikeStatus
}
export interface LikesBdModel {
    _id: ObjectId
    commentId: string
    userId: string
    myStatus: LikeStatus //	h11.LikeStatusstring Enum:    Array[3]

}
export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}
