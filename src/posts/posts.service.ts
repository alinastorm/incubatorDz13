import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogBdDocument } from 'src/blogs/blog.model';
import { LikeStatus } from 'src/likes/like.model';
import { setPaginator } from 'src/_commons/helpers/paginator';
import { Paginator, PaginatorQueries } from 'src/_commons/types/types';
import { ExtendedLikesInfoBd,Post, PostBd, PostBdDocument, PostInput, PostView, postViewDataMapper } from './post.model';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: Model<PostBdDocument>,
        @InjectModel(Blog.name) private BlogModel: Model<BlogBdDocument>,
    ) { }
    readAllCommentsfromPost(postId: string, queries: PaginatorQueries) {

    }
    async readAllPostsWithPaginator(queries: PaginatorQueries): Promise<Paginator<PostView>> {

        const { pageNumber, pageSize, sortBy, sortDirection = 1 } = queries
        const docCount = await this.PostModel.countDocuments()

        const postsModel = await this.PostModel
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection })
            .lean({ virtuals: true })

        const posts = postsModel.map(postViewDataMapper)
        const result = setPaginator(posts, pageNumber, pageSize, docCount)
        return result
    }
    async addOnePost(data: PostInput): Promise<PostView> {
        const { blogId, content, shortDescription, title } = data
        const createdAt = new Date().toISOString()
        const blog = await this.BlogModel.findById(blogId)
        if (!blog) throw new Error("return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)")
        const { name: blogName } = blog
        const extendedLikesInfo: ExtendedLikesInfoBd = {
            likes: [],
            deslike: []
        }
        const elementPost: Omit<PostBd, "_id"> = { blogId, blogName, content, createdAt, extendedLikesInfo, shortDescription, title }
        this.PostModel.schema.virtual('extendedLikesInfo.myStatus').get(function () {
            return LikeStatus.None;
        });
        const post = await this.PostModel.create(elementPost).then(postViewDataMapper)
        return post
    }
    readOnePost() { }
    updateOnePost() { }
    deleteOnePost() { }

}
