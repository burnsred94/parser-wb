import { Injectable, BadRequestException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { UserService } from '../user/user.service';
import { StatusUserBot } from 'src/interfaces/telegraf-context.interfaces';
import { User } from '../user/schemas/user.schema';
import { Login } from '../sessions/schemas/interfaces/sessions.interfacs';


@Injectable()
export class AuthService {

    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) { }

    async register(data: string, id: number) {
        const passGenerate = randomUUID()
        const api_url = await this.configService.get('API_URL');
        const pass = passGenerate.split('-')[0];

        await axios.post(`${api_url}/auth/local/register`, {
            "email": data,
            "username": data,
            "password": pass,
            "registered_from_url": "/telegram-ai-bot"
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).catch((error: AxiosError) => {
            if (error.response.status === 500) {
                throw new BadRequestException("При регистрации <b>SellersHub</b> произошла ошибка.\nОбратитесь в поддержку 🤝\n\nСкорее всего вы уже есть в нашем сервисе\nПопробуйте авторизовться")
            }
        }).then(async () => {
            await this.userService.updateUser(id, {email: data})

        });

        return {
            pass: pass,
            email: data
        }
    }

    async authLogin(id: number,data: Partial<Login>) {

        const api_url = await this.configService.get('API_URL');

        await axios.post(`${api_url}/auth/local`, {
            identifier: data.email,
            password: data.password,
        }).catch((error: AxiosError) => {
            if (error.response.status === 500 || error.response.status === 400) {
                throw new BadRequestException("При авторизации <b>SellersHub</b> произошла ошибка.\nОбратитесь в поддержку 🤝\n\nВозможные причины ошибки:\n⛔Вы указали неправильные данные для входа\n⛔Вы у нас не зарегистрированы\n⛔Ваша почта не подтверждена")
            }
        }).then(async (res) => {
            console.log(res)
            await this.userService.updateUser(id,{
                email: data.email,
                confirmed: true,
            })
        })

    }



}


