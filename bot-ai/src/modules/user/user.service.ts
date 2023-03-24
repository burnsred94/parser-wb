import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/interfaces';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private _userRepository: Model<UserDocument>,
    ) { }

    async create(user: Partial<User>) {
        return await this._userRepository.create(user);
    }

    async findByTelegram(telegramUser: string) {
        return await this._userRepository.findOne({
            telegramUser: telegramUser,
        });
    }

    async updateUser(id, data) {
        await this._userRepository.findOneAndUpdate({
            telegramUserId: id,

        });

        console.log;
    }

    async findByTelegramUserUpdateTelegramId(
        telegramUser: string,
        data: Partial<User>,
    ) {
        const user = await this._userRepository.findOne({ telegramUser: telegramUser });

        console.log(user);

        if (user) {
            const updateUser = await this._userRepository.findOneAndUpdate(
                {
                    telegramUser: telegramUser
                },
                {
                    $set: {
                        ...data,
                    },
                }
            );

            updateUser.save();
        } else {
            const newData = {
                telegramUser: telegramUser,
                telegramUserId: data.telegramUserId,
                ...data,
            };
            const newUser = await this._userRepository.create(newData);
            newUser.save();
        }
    }

    async updateGenerateSymbols(id, number) {
        return await this._userRepository.findOneAndUpdate({
            telegramUserId: id,
            $inc: {
                generateSymbol: -number,
            },
        });
    }

    async findByTelegramId(telegramId: User['telegramUserId']) {
        console.log(telegramId);
        return await this._userRepository.findOne({
            telegramUserId: telegramId,
        });
    }

    async findAll() {
        return await this._userRepository.find();
    }
}
