import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Blog, BlogBd, BlogBdDocument, BlogView } from 'src/blogs/blog.model';
import { LikeStatus } from 'src/comments/like.model';
import { setPaginator } from 'src/_commons/helpers/paginator';
import { HTTP_STATUSES, Paginator, PaginatorQueries } from 'src/_commons/types/types';
import { ExtendedLikesInfoBd, Post, PostBd, PostBdDocument, PostInput, PostView, postViewDataMapper } from './post.model';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: Model<PostBdDocument>,
        @InjectModel(Blog.name) private BlogModel: Model<BlogBdDocument>,
    ) { }

    async readAllWithPaginator(queries: PaginatorQueries): Promise<Paginator<PostView>> {

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
    async addOne(data: PostInput): Promise<PostView> {
        const { blogId, content, shortDescription, title } = data
        const createdAt = new Date().toISOString()
        const blog = await this.BlogModel.findById(blogId)
        // if (!blog) throw new Error("return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)")
        const { name: blogName } = blog
        const extendedLikesInfo: ExtendedLikesInfoBd = {
            likes: [],
            deslike: []
        }
        const elementPost: Post = { blogId, blogName, content, createdAt, extendedLikesInfo, shortDescription, title }
        this.PostModel.schema.virtual('extendedLikesInfo.myStatus').get(function () {
            return LikeStatus.None;
        });
        await this.PostModel.validate()
        const post = await this.PostModel.create(elementPost).then(postViewDataMapper)
        return post
    }
    async readOne(postId: string, userId?: string) {

        this.PostModel.schema.virtual('extendedLikesInfo.myStatus').get(function () {

            const likes = this.extendedLikesInfo.likes.filter((elem) => elem.userId === userId)
            const deslikes = this.extendedLikesInfo.deslike.filter((elem) => elem.userId === userId)

            const result: LikeStatus =
                (likes[0] ? LikeStatus.Like : undefined) ||
                (deslikes[0] ? LikeStatus.Dislike : undefined) ||
                LikeStatus.None
            return result
        });

        const post = await this.PostModel.findById(postId).lean({
            virtuals: true,
            //   transform: postDataMapper,
        }).then(postViewDataMapper)

        if (!post) {
            throw new HttpException([{ message: "post not found", field: "post" }], HTTP_STATUSES.NOT_FOUND_404)
        }
        return post
    }
    async updateOne(postId: string, postUpdates: PostInput) {
        const filter = { postId }
        const result = await this.PostModel.updateOne(filter, postUpdates)
        return result.modifiedCount === 1
    }
    async deleteOnePost(postId: string) {
        const filter = { postId }
        const result = await this.PostModel.deleteOne(filter)
        return result.deletedCount === 1

    }
    async readAllByBlog(blogId: string, queries: PaginatorQueries): Promise<Paginator<PostView>> {
        const { pageNumber, pageSize, sortBy, sortDirection = 1 } = queries
        const docCount = await this.PostModel.countDocuments()
        const filter: FilterQuery<BlogBd> = { blogId }
        const postsModel = await this.PostModel
            .find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection })
            .lean({ virtuals: true })
        const blogs = postsModel.map(postViewDataMapper)
        const result = setPaginator(blogs, pageNumber, pageSize, docCount)
        return result
    }
}
