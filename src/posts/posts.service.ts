import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Blog, BlogBd, BlogDocument, BlogView } from '../blogs/blog.model';
import { LikeStatus } from '../comments/like.model';
import { setPaginator } from '../_commons/helpers/paginator';
import { HTTP_STATUSES, Paginator, PaginatorQueries } from '../_commons/types/types';
import { ExtendedLikesInfoBd, ExtendedLikesInfoSchema, PostSchema, Post, PostBd, PostDocument, PostInput, PostView, postViewDataMapper, BlogPostInput } from './post.model';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: Model<PostDocument>,
        @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    ) { }

    async readAllWithPaginator(query: PaginatorQueries): Promise<Paginator<PostView>> {

        const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = -1, searchNameTerm } = query
        let filter: FilterQuery<PostBd> = {}
        if (searchNameTerm) filter = { name: { $regex: searchNameTerm, $options: 'i' } }
        const count = await this.PostModel.countDocuments(filter);
        const postsModel = await this.PostModel
            .find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection })
            // .lean({ virtuals: true })

        const posts = postsModel.map(postViewDataMapper)
        const result = setPaginator(posts, pageNumber, pageSize, count)
        return result
    }
    async addOne(data: PostInput): Promise<PostView> {

        new Logger().log('addOne Post')
        const { content, shortDescription, title,blogId } = data
        const createdAt = new Date().toISOString()
        const blog = await this.BlogModel.findById(blogId)
        // if (!blog) throw new Error("return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)")
        if (!blog) {
            throw new HttpException([{ message: "blog not found", field: "blog" }], HTTP_STATUSES.NOT_FOUND_404)
        }
        const { name: blogName } = blog
        const extendedLikesInfo: ExtendedLikesInfoBd = {
            likes: [],
            deslike: []
        }
        const elementPost: Post = { blogId, blogName, content, createdAt, extendedLikesInfo, shortDescription, title }
        this.PostModel.schema.virtual('extendedLikesInfo.myStatus').get(function () {
            return LikeStatus.None;
        });

        const post = await this.PostModel.create(elementPost).then(postViewDataMapper)
        return post
    }
    async addOneToBlog(blogId: string, data: BlogPostInput): Promise<PostView> {

        new Logger().log('addOneToBlog Post')

        const { content, shortDescription, title } = data
        const createdAt = new Date().toISOString()
        const blog = await this.BlogModel.findById(blogId)
        // if (!blog) throw new Error("return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)")
        if (!blog) {
            throw new HttpException([{ message: "blog not found", field: "blog" }], HTTP_STATUSES.NOT_FOUND_404)
        }
        const { name: blogName } = blog
        const extendedLikesInfo: ExtendedLikesInfoBd = {
            likes: [],
            deslike: []
        }
        const elementPost: Post = { blogId, blogName, content, createdAt, extendedLikesInfo, shortDescription, title }
        this.PostModel.schema.virtual('extendedLikesInfo.myStatus').get(function () {
            return LikeStatus.None;
        });

        const post = await this.PostModel.create(elementPost).then(postViewDataMapper)
        return post
    }
    async readOne(postId: string, userId?: string) {
        new Logger().log('readOne Post')
        
        //@ts-ignore
        // this.PostModel.setUserId(userId)
        const post = await this.PostModel.findById(postId).then(postViewDataMapper)

        if (!post) {
            throw new HttpException([{ message: "post not found", field: "postId" }], HTTP_STATUSES.NOT_FOUND_404)
        }
        return post
    }
    async updateOne(postId: string, postUpdates: PostInput) {
        new Logger().log('updateOne Post')
        
        const filter = { postId }
        const result = await this.PostModel.updateOne(filter, postUpdates)
        return result.modifiedCount === 1
    }
    async deleteOnePost(postId: string) {
        new Logger().log('deleteOnePost Post')

        const filter = { postId }
        const result = await this.PostModel.deleteOne(filter)
        return result.deletedCount === 1

    }
    async readAllByBlog(blogId: string, queries: PaginatorQueries): Promise<Paginator<PostView>> {
        new Logger().log('readAllByBlog Post')

        const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = -1, searchNameTerm } = queries

        const filter: FilterQuery<BlogBd> = { blogId }
        if (searchNameTerm) filter['name'] = { name: { $regex: searchNameTerm, $options: 'i' } }
        const count = await this.PostModel.countDocuments(filter);
        const postsModel = await this.PostModel
            .find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection })
            // .lean({ virtuals: true })
        const blogs = postsModel.map(postViewDataMapper)
        const result = setPaginator(blogs, pageNumber, pageSize, count)
        return result
    }
}
