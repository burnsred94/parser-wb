import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action, StatusUserBot, TelegrafContext } from 'src/interfaces/telegraf-context.interfaces';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { IRegisterInit } from './interfaces/register-init.interfaces';
import { keyboardsInit } from './utils/keyboards';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import { CopywritingData } from '../sessions/schemas/interfaces/sessions.interfacs';

@Injectable()
export class InitializerService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) { }

    // async registerInit(ctx: TelegrafContext): Promise<IRegisterInit> {
    //     const message = ctx.message;
    //     const { text } = <{ text: string }>message;

    //     if (text.match(EMAIL_REGEXP)) {
    //         const dataRegister = await this.authService.register(ctx.update)
    //         if (dataRegister.type === 'error') {
    //             return {
    //                 message: 'Ты наверное у нас уже зарегистрирован.\nЕсли У тебя возникли трудности обратись в нашу службу поддержки',
    //                 state: Action.DEFAULT
    //             }
    //         } else {
    //             ctx.session.statusUser = StatusUserBot['REGISTERED_BOT'];

    //             return {
    //                 message: `🎉Поздравляем ты успешно зарегистрировался!\nТебе осталось только подтвердить свою почту.\n\nТвой почта: ${text}\nПароль: <b>${dataRegister.pass}</b>\n\nНаши сервисы: 
    //                       `,
    //                 state: Action.REGISTER_SUCCESS
    //             }
    //         }
    //     } else {
    //         return {
    //             message: 'Ops 🤥 наверное ты сделал что то не так 😞',
    //             state: Action.REGISTER
    //         }
    //     }
    // }

    async confirmInit(ctx: TelegrafContext) {
        const { username } = <{ username: string }>ctx.message.chat;
        const { first_name } = ctx.message.from

        return keyboardsInit(ctx.session.statusUser, first_name)
    }

    async getUserToApi(telegramName: string) {
        const api_url = await this.configService.get('API_URL')
        const user = await axios.post(`${api_url}/verify/tg`, { tg: `https://t.me/${telegramName}` });
        const { data } = user.data;
        if (data) {
            return true;
        } else {
            return false;
        }
    }

    async getAiDataBot(data: CopywritingData, id) {
        const url_ai = await this.configService.get('API_AI_BOT')

        const response = await axios.post(`${url_ai}`, {
            data: {
                product_name: data.name,
                short_description: data.description,
                keywords: data.keywords
            }
        }).catch((err: AxiosError) => {
            throw new BadRequestException('К сожалению мы не смогли сгенирировать текст\n\nПопробуйте позже')
        }).then((res: AxiosResponse) => {
            this.userService.updateGenerateSymbols(id, res.data.text.length)
            return res.data.text
        })

        return response
    }

    async initStartKeyboard(status: StatusUserBot) {
        try {
            if (status == StatusUserBot.NOT_REGISTERED) {

                const link = path.join(__dirname, '..', '..', '..', '/public/Ad_Banner.png');
                const sourceImg = fs.createReadStream(link)

                return {
                    img: sourceImg,
                    caption: `Рады приветствовать в сервисе <b>AI-копирайтинга</b> от <a href="https://sellershub.ru/?utm_medium=smm&utm_source=tg&utm_campaign=bot_ai&utm_term=bot_button&utm_content=1">Sellershub.ru</a>\n\nСервис использует <b>искусственный интеллект</b> для написания SEO-текста для описания товара <b>используя ваши ключи</b> для товара.\n\nМы обучаем нашу модель на базе товаров Wildberries\n\nЧтобы начать пользоваться ботом, зарегистрируйтесь или авторизуйтесь.`,
                    keyboard: {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "📑 Регистрация", callback_data: 'register' }, { text: "🔑 Авторизация", callback_data: 'login' }],
                                [{ text: "🤝 Поддержка", callback_data: 'support' }],
                                [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }]
                            ]
                        }
                    }
                }

            } else if (status == StatusUserBot.REGISTERED_BOT) {
                const link = path.join(__dirname, '..', '..', '..', '/public/Registration_success.png');
                const sourceImg = fs.createReadStream(link)

                return {
                    img: sourceImg,
                    caption: `Здраствуйте, вы не подтвердили свою электронную почту.\nНекоторые функции вам могут быть не доступны.\n\nПожалуйста подтвердите свою электронную почту для доступа к нашим сервисам и услугам`,
                    keyboard: {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "🔐 AI - Копирайтер ", callback_data: 'not_access' }],
                                [{ text: "🔐  Другие Сервисы ", callback_data: 'not_access' }],
                                [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }],
                                [{ text: "🤝 Поддержка", callback_data: 'support' }],
                                [{ text: "🔑 Авторизация", callback_data: 'login' }],
                                [{ text: "🚪🚶 Выйти", callback_data: 'logout' }]
                            ]
                        }
                    }
                }
            } else if (status == StatusUserBot.REGISTER_BOT_SITE) {
                return {
                    caption: `1️⃣ В 93% случаев бот пишет конечный текст, не требующий правок, тогда как на других сервисах релевантно лишь каждое третье описание, о чём свидетельствуют тесты пользователей.\n\n2️⃣ Самообучаемость на базе на 30.000+ товаров WB позволяет боту отлично анализировать и расставлять в тексте заданные вами ключи. Поэтому он улучшает показатели SEO и полностью соответствует целевой аудитории.\n\n3️⃣ Наш АИ-бот разработан для экономии ресурсов: благодаря его интуитивному интерфейсу и мгновенным результатам, вам не придется тратить время на поиск информации.\n\n4️⃣ Наш бот не требует использования VPN, и на территории СНГ не возникнет проблем с регистрацией. Более того, доступны различные способы оплаты: через Юмани, Тинькофф или Сбер.\n\nВоспользуйтесь нашим АИ-ботом уже сегодня и оцените его уникальные преимущества! 🚀`,
                    keyboard: {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "🤖 AI - Копирайтер", callback_data: 'copywriter' }],
                                [{ text: "📟 Другие Сервисы", callback_data: 'services' }],
                                [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }],
                                [{ text: "🤝 Поддержка", callback_data: 'support' }],
                                [{ text: "🚪🚶 Выйти", callback_data: 'logout' }]
                            ]
                        },
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }

    }

    async initKeyboard(action: Action, id?: number) {
        const symbols = await this.userService.findByTelegramId(id)

        switch (action) {
            case Action.AI_COPYWRITER: {
                return {
                    message: `Хотите другое описание?\n\nУ вас осталось символов для генирации ${symbols.generateSymbol < 0 ? 0 : symbols.generateSymbol}`,
                    keyboard: {
                        reply_markup: {
                            inline_keyboard: [
                                [symbols.generateSymbol > 0 ? { text: "Генерировать еще 🤖", callback_data: 'copywriter' } : { text: 'Пополнить 💊', url: 'https://t.me/evgeniy_sellershub_ru' }, { text: "Оцените работу AI ⭐", callback_data: 'review' }],
                                [{ text: "🔙 Вернуться в меню", callback_data: 'start' }]
                            ]
                        }
                    }
                }
            }
            case Action.REVIEW: {

            }
        }
    }

}
