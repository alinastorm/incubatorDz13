import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { setPaginator } from 'src/_commons/helpers/paginator';
import { Paginator, PaginatorQueries } from 'src/_commons/types/types';
import { Blog, BlogBdDocument, BlogInput, BlogView, BlogViewDataMapper } from './blog.model';

@Injectable()
export class BlogsService {

    constructor(
        @InjectModel(Blog.name) private BlogModel: Model<BlogBdDocument>,
        @InjectModel(Post.name) private PostModel: Model<PostBdDocument>,
    ) { }

    async readAllBlogsWithPaginator(queries: PaginatorQueries): Promise<Paginator<BlogView>> {
        const { pageNumber, pageSize, sortBy, sortDirection = 1 } = queries
        const docCount = await this.BlogModel.countDocuments()

        const blogsModel = await this.BlogModel
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection })
            .lean({ virtuals: true })

        const blogs = blogsModel.map(BlogViewDataMapper)
        const result = setPaginator(blogs, pageNumber, pageSize, docCount)
        return result
    }
    async addOneBlog(data: BlogInput): Promise<BlogView> {
        const { name, websiteUrl, description } = data
        const createdAt = new Date().toISOString()
        const elementBlog: Omit<BlogView, "id"> = { createdAt, name, websiteUrl, description }
        const blog = await this.BlogModel.create(elementBlog).then(BlogViewDataMapper)
        return blog
    }
    async readAllPostsFromBlog(blogId: string, queries: PaginatorQueries): Promise<Paginator<PostView>> {
        const { pageNumber, pageSize, sortBy, sortDirection = 1 } = queries

        const filter: FilterQuery<BlogView> = { blogId }
        const posts: BlogView = await this.PostModel.find(filter)

    }
}
