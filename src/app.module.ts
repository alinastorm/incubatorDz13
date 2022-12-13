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
import { CryptoService } from './_commons/services/crypto-service';
import { Auth } from './auth/auth.model';
// import { UserSchemaClass } from './user/user.model';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './posts/posts.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://AlexGr:mth0F2JOfBhmJlk4@cluster0.ojk6ayv.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Auth.name, schema: UserSchema }]),
  ],
  // imports: [MongooseModule, UserModule],
  controllers: [AppController, UserController, PostsController, CommentsController, BlogsController, TestingController],
  providers: [AppService, UserService,CryptoService, BlogsService, PostsService],
  // providers: [AppService, UserService,UserSchemaClass],
})
export class AppModule { }
