import { Controller, Get, Body, Post, Param, Query, Res, Delete, HttpCode } from '@nestjs/common';
import { UserInput, UserViewDocument, userViewDataMapper, UserInputDto } from './user.model';
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
    async addOneUser(@Body() user: UserInputDto): Promise<UserViewDocument | any> {
        return await this.userService.addOne(user)
    }

    @Delete(":id") @HttpCode(204)
    async deleteOneUserById(@Param("id") id: string) {
        await this.userService.deleteOne(id)
    }

}
