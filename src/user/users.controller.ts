import { Controller, Get, Body, Post, Param, Query, Res, Delete, HttpCode } from '@nestjs/common';
import { UserInput, UserViewDocument, userViewDataMapper } from './user.model';
import { UserService } from './users.service';
import { Response } from 'express';
//TODO
@Controller('users') export class UserController {

    constructor(protected userService: UserService) { }

    @Get()
    async readAllUsers() {
        return await this.userService.readAll()
    }

    @Post()
    async addOneUser(
        @Body()
        body: UserInput): Promise<UserViewDocument | any> {
        return await this.userService.addOne(body)
    }

    @Delete(":id")
    @HttpCode(204)
    async deleteOneUserById(
        @Param("id") id: string
    ) {
        return await this.userService.deleteOne(id)
    }

}
