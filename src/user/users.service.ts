import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserBd, UserBdDocument, UserInput, userViewDataMapper, UserView } from './user.model';
import { Model, ObjectId } from 'mongoose';
import { CryptoService } from 'src/_commons/services/crypto-service';
import { Auth, AuthDocument, AuthView } from 'src/auth/auth.model';


@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private UserModel: Model<UserBdDocument>,
        @InjectModel(Auth.name) private AuthModel: Model<AuthDocument>,
        private cryptoService: CryptoService,
    ) { }

    async readAll() {
        const users = await this.UserModel.find().lean()
        return users.map(userViewDataMapper)
    }
    async addOne({ email, login, password }: UserInput): Promise<UserView> {
        const createdAt = new Date().toISOString()
        const elementUser: Omit<UserBd, '_id'> = { email, login, createdAt, confirm: true }
        const user = await this.UserModel.create(elementUser).then(userViewDataMapper)
        const userId = user.id
        const passwordHash = await this.cryptoService.generatePasswordHash(password)
        const elementAuth: Omit<AuthView, "id"> = { passwordHash, userId, createdAt }
        await this.AuthModel.create(elementAuth)
        return user
    }
    async deleteOne(id: string) {
        return (await this.UserModel.deleteOne({ _id: id })).deletedCount === 1
    }
}
