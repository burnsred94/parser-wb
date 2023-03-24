import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/interfaces';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private _userRepository: Model<UserDocument>){}

    async create(user: Partial<User>) {
         return await this._userRepository.create(user)
    }

    async findByTelegram(telegramUser: string) {
        return await this._userRepository.findOne({ telegramUser })
    }

    async updateUser(id, data) {
        return await this._userRepository.findOneAndUpdate({
            where: {
                userId: id
            },
            $set:data,
        })
    }

    async findByTelegramUserUpdateTelegramId(telegramUser: string, data: Partial<User>) {
        return await this._userRepository.findOneAndUpdate({
            where: {
                telegramUser: telegramUser
            },
            $set:data,
        })
    }

    async updateGenerateSymbols(id, number) {
        return await this._userRepository.findOneAndUpdate({
            where: {
                userId: id
            },
            $inc: {
                generateSymbol: -number
            }
        })
    }

    async findByTelegramId (telegramId: User['telegramUserId']) {
        return await this._userRepository.findOne({ telegramId })
    }

    async findAll(){
        return await this._userRepository.find()
    }

}
