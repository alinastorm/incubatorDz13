import { HydratedDocument, ObjectId } from "mongoose"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export interface BlogInput {
    name: string//    maxLength: 15
    description: string // maxLength: 500
    websiteUrl: string // maxLength: 100     pattern: ^ https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

}
export interface BlogView {
    id: string
    name: string// max 15 TODO вроде уже нет ограничения
    description: string // maxLength: 500
    websiteUrl: string
    createdAt: string//TODO в дз не обязательный в интерфейсе
}
export interface BlogBd {
    _id: ObjectId
    name: string// max 15 TODO вроде уже нет ограничения
    description: string // maxLength: 500
    websiteUrl: string
    createdAt: string//TODO в дз не обязательный в интерфейсе
}
export type BlogBdDocument = HydratedDocument<BlogBd>;
export type BlogViewDocument = HydratedDocument<BlogView>;

@Schema({ versionKey: false })
export class Blog implements BlogBd {

    @Prop() _id: ObjectId
    @Prop() name: string
    @Prop() description: string
    @Prop() websiteUrl: string 
    @Prop() createdAt: string //	TODO в дз не обязательный в интерфей

}
export function BlogViewDataMapper(value: BlogBdDocument | null): BlogView | null {
    return value ?
        {
            id: value._id.toString(),
            createdAt: value.createdAt,
            description: value.description,
            name: value.name,
            websiteUrl: value.websiteUrl
        } : null
}

export const BlogSchema = SchemaFactory.createForClass(Blog);