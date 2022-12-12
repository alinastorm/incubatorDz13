import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserBd, UserBdDocument, UserInput } from './user.model';
import { Model } from 'mongoose';
import { CryptoService } from 'src/_commons/services/crypto-service';
import { Auth, AuthDocument, AuthView } from 'src/auth/auth.model';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private UserModel: Model<UserBdDocument>,
        @InjectModel(Auth.name) private AuthModel: Model<AuthDocument>,
        private cryptoService: CryptoService
    ) { }
    // constructor(private userModel:UserModel){}

    async readAll() {
        return await this.UserModel.find().lean()
    }
    async createOne({ email, login, password }: UserInput) {

        const createdAt = new Date().toISOString()
        const elementUser: Omit<UserBd, 'id'> = { email, login, createdAt, confirm: true }
        const user = await this.UserModel.create(elementUser)
        const idUser = user._id.toString()
        const passwordHash = await this.cryptoService.generatePasswordHash(password)
        const elementAuth: Omit<AuthView, "id"> = { passwordHash, userId: idUser, createdAt }
        await this.AuthModel.create(elementAuth)
        return user
        
    }


}
