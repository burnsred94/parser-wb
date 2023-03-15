import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EMAIL_REGEXP } from 'src/constants/constants';
import { Action, TelegrafContext } from 'src/interfaces/telegraf-context.interfaces';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { IRegisterInit } from './interfaces/register-init.interfaces';
import { keyboardsInit } from './utils/keyboards';

@Injectable()
export class InitializerService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) { }

    async registerInit(ctx: TelegrafContext): Promise<IRegisterInit> {
        const message = ctx.message;
        const { text } = <{ text: string }>message;

        if (text.match(EMAIL_REGEXP)) {
            const dataRegister = await this.authService.register(ctx.update)
            if (dataRegister.type === 'error') {
                return {
                    message: 'Ты наверное у нас уже зарегистрирован.\nЕсли У тебя возникли трудности обратись в нашу службу поддержки',
                    state: Action.DEFAULT
                }
            } else {
                return {
                    message: `🎉Поздравляем ты успешно зарегистрировался!\nТебе осталось только подтвердить свою почту.\n\nТвой почта: ${text}\nПароль: <b>${dataRegister.pass}</b>\n\nНаши сервисы: 
                          `,
                    state: Action.DEFAULT
                }
            }
        } else {
            return {
                message: 'Ops 🤥 наверное ты сделал что то не так 😞',
                state: Action.REGISTER
            }
        }
    }

    async confirmInit(ctx: TelegrafContext) {
        const { username } = <{ username: string }>ctx.message.chat;
        const { first_name } = ctx.message.from


            const user = await this.userService.findByTelegram(username);
            const check = user ? true : await this.getUserToApi(username)
            return check ? keyboardsInit(check, first_name) : keyboardsInit(check, first_name)
    }

    async getUserToApi(telegramName: string) {
        const api_url = await this.configService.get('API_URL')
        const user = await axios.post(`${api_url}/api/v1/verify/tg`, { tg: `https://t.me/${telegramName}` });
        console.log(user.data)
        const { data } = user.data;
        if (data) {
            return true;
        } else {
            return false;
        }
    }

    async getAiDataBot(desc: TelegrafContext) {
        const session = desc.session.copywriting_data
        const url_ai = await this.configService.get('API_AI_BOT')

        const getDataAi = await axios.post(`${url_ai}`, {
            data: {
                product_name: session.name,
                short_description: session.description,
                keywords: session.keywords
            }
        });
        
        return await getDataAi.data;
    }

}
