import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { UserService } from '../user/user.service';
import { StatusUserBot } from 'src/interfaces/telegraf-context.interfaces';


@Injectable()
export class AuthService {

    constructor(
        private readonly configService: ConfigService, 
        private readonly userService: UserService
        ){}

    async register(data) {
        try {
            const { text, chat } = data.message;
            const passGenerate = randomUUID()
            const api_url = await this.configService.get('API_URL');
            const pass = passGenerate.split('-')[0]
            const dataRegistration = await axios.post(`${api_url}/auth/local/register`, {
                "email": text,
                "username": text,
                "password": pass,
                "registered_from_url": "/telegram-ai-bot"
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            )
            

            if(dataRegistration.status === 200) {
                const { id , email, confirmed } = dataRegistration.data.user

                await this.userService.create({
                    id: id as string,
                    email: email as string,
                    username: email as string,
                    confirmed: confirmed as boolean,
                    password: pass as string,
                    telegramUser: chat.username as string,
                });                 
            }

            return {dataRegistration, pass}

        }catch (err) {
            return { type: "error", message: err.message}
        }
    }

    async authLogin (data) {
        const userInDb = await this.userService.findByTelegram(data);

        if(userInDb) {
            const api_url = await this.configService.get('API_URL');

                const loginApi = await axios.post(`${api_url}/auth/local`, {
                    identifier: userInDb.email,
                    password: userInDb.password,
                }).then((res) => {
                    if(res.status === 200 && res.data.jwt) {
                        return StatusUserBot['REGISTER_BOT_SITE'];
                    }
                }).catch((err) => {
                    if(err.response.status === 500){
                        return StatusUserBot['REGISTERED_BOT']
                    }
                })

                if(loginApi === StatusUserBot['REGISTER_BOT_SITE']) {
                    await this.userService.updateUser({
                        telegramUser: userInDb.telegramUser, 
                        confirmed: true});
                    return StatusUserBot['REGISTER_BOT_SITE'];
                }else if(loginApi === StatusUserBot['REGISTERED_BOT']) {
                    return StatusUserBot['REGISTERED_BOT'];
                }
        }
    }

    

}


