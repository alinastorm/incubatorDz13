import { Controller, Get, Body, Post, Param, Query, Delete, Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, LeanDocument } from 'mongoose';

export interface UserInput {
    login: string // maxLength: 10 minLength: 3
    password: string // maxLength: 20 minLength: 6
    email: string // pattern: ^ [\w -\.] +@([\w -] +\.) +[\w -]{ 2, 4 } $
}
export interface UserView {
    id: string
    login: string
    email: string
    createdAt?: string //	TODO в дз не обязательный в интерфей
}
export interface UserBd {
    id: string
    login: string
    email: string
    confirm: boolean //мое
    createdAt?: string //	TODO в дз не обязательный в интерфей
}
export interface UsersSearchPaginationMongoDb {
    /**Search term for user Login: Login should contains this term in any position
     * Default value : null
     */
    searchLoginTerm: string
    /**Search term for user Email: Email should contains this term in any position
     * Default value : null
     */
    searchEmailTerm: string
    /**PageNumber is number of portions that should be returned.
     * Default value : 1
     */
    pageNumber: number
    /**PageSize is portions size that should be returned
     * Default value : 10
     */
    pageSize: number
    /** Sorting term
     * Default value : createdAt
     */
    sortBy: string
    /** Sorting direction
     * Default value: desc
     */
    sortDirection: 1 | -1
}

export type UserBdDocument = HydratedDocument<UserBd>;
export type UserViewDocument = HydratedDocument<UserView>;

@Schema()
export class User {

    @Prop() id: String
    @Prop() login: String
    @Prop() email: String
    @Prop() confirm: Boolean //мое
    @Prop() createdAt: String //	TODO в дз не обязательный в интерфей

}
export function userViewDataMapper(value: LeanDocument<UserBd & Required<{ _id: string; }>> | null): UserView | null {
    if (!value) return null
    const result: UserView = {
        id: value._id ?? value.id,//value.id так как пихаю в старый модуль repository а он мапит _id=>id 
        login: value.login,
        email: value.email,
        createdAt: value.createdAt //	TODO в дз не обязательный в интерфей
    }
    return result;
}
// @Injectable()
// export class UserMongoose{
//     userSchema = SchemaFactory.createForClass(User);
// }
export const UserSchema = SchemaFactory.createForClass(User);