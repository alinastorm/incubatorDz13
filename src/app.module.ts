import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/users.controller';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { BlogsController } from './blogs/blogs.controller';
import { TestingController } from './testing/testing.controller';
import { UserService } from './user/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.model';
import { Auth, AuthSchema } from './auth/auth.model';
// import { UserSchemaClass } from './user/user.model';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './posts/posts.service';
import { CryptoService } from './_commons/services/crypto-service';
import { Blog, BlogSchema } from './blogs/blog.model';
import { Post, PostSchema } from './posts/post.model';
import { CommentsService } from './comments/comments.service';
import { CommentSchema, Comment } from './comments/comment.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://AlexGr:mth0F2JOfBhmJlk4@cluster0.ojk6ayv.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  // imports: [MongooseModule, UserModule],
  controllers: [AppController, UserController, PostsController, CommentsController, BlogsController, TestingController,CommentsController],
  providers: [AppService, CryptoService, UserService, BlogsService, PostsService, CommentsService],
  // providers: [AppService, UserService,UserSchemaClass],
})
export class AppModule { }
