import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { UserService } from '../user/user.service';


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
            const dataRegistration = await axios.post(`${api_url}/api/v1/auth/local/register`, {
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

    

}


