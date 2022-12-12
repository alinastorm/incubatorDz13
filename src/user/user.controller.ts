import { Controller, Get, Body, Post, Param, Query, Delete } from '@nestjs/common';
import { UserInput, UserViewDocument } from './user.model';
import { UserService } from './user.service';


@Controller('users') export class UserController {

    constructor(protected userService: UserService) { }

    @Get() readAllUsers() {
        return this.userService.readAll()
    }

    @Post() async addNewUser(
        @Body() body: UserInput): Promise<UserViewDocument> {
        return await this.userService.createOne(body)
    }

    @Delete(":id") deleteUserById(
        @Param("id") id: string) {
    }
}
