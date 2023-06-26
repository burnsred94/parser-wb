import { ConfigService } from '@nestjs/config';
// import { Cron } from '@nestjs/schedule';
import { Update } from 'nestjs-telegraf';
import { Telegram } from 'telegraf';

// export class TaskManager {
//     constructor(
//         private readonly bot: Telegram,
//         private readonly userId: number
//     ) {
//     }

//     @Cron('* * * * * ')
//     async messageEmailRegister() {
//         console.log('messageEmailRegister');
//     }

//     @Cron('* * * * *')
//     async Event() {
//         console.log('messageEmailUpdate');
//     }
// }

// export class TaskManagerService {
//     bot: Telegram;
//     configService: ConfigService
//     userId: number;



//     constructor() {
//         this.configService = new ConfigService();
//         this.bot = new Telegram(this.configService.get('TOKEN_DEV_TELEGRAM'));
//     }

//     fabric(userId: number): TaskManager {
//         return new TaskManager(this.bot, userId);
//     }
// }

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { UserService } from '../user/user.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TaskManagerService {
    bot: Telegram;
    configService: ConfigService

    constructor(private readonly userService: UserService) {
        this.configService = new ConfigService();
        this.bot = new Telegram(this.configService.get('TOKEN_PROD_TELEGRAM'));
    }



    // @Cron(CronExpression.EVERY_10_SECONDS, { timeZone: 'Europe/Moscow' })
    // async event() {
    //     const users = await this.userService.findAll();

    //     const link = path.join(__dirname, '../../../public/photo_2023-03-22_17-18-36.jpg')
    //     const sourceImg = fs.createReadStream(link)
    //     console.log(link)
    //     users.map(async (user) => {
    //        await this.bot.sendPhoto(user.telegramUserId, {source: sourceImg},{
    //         caption: `<b>🔥Эксклюзивное предложение для наших пользователей🔥</b>\n\nВы успели оценить нашего ИИ-бота, обученного на основе 30 000 описаний товаров ВБ. И точно знаете, насколько он облегчает работу. У нас для вас особое предложение🤫\n\n🎁 Получите ПОЛНЫЙ доступ к генерации 5000 описаний на Вайлдберриз всего за 1000 RUB на 3 месяца! 🎁\n\n⏳ Акционное предложение действует до 27 марта!`,
    //         parse_mode: 'HTML'
    //     });
    //        await this.bot.sendMessage(user.telegramUserId, `С полным доступом Вы сможете:\n\n✅ Сэкономить время на создание качественных описаний, благодаря обученному боту.\n✅ Увеличить конверсию и продажи с помощью SEO-текстов. ИИ-бот вставляет ключевые слова для лучшей индексации товара на Вайлдберриз.\n✅ Сосредоточиться на важных аспектах бизнеса, пока бот пишет тексты.\n\nДля активации акции и оплаты напишите @JayPr0  пометкой ЛОЯЛЬНЫЙ2023`)
    //        await this.bot.sendMessage(user.telegramUserId, `🎉А ещё у нас есть бонус🎉\n\nХотите получить пополнение на 50 000 символов? Напишите @JayPr0, уделите 10-15 минут на небольшой опрос и мы пополним Ваш баланс!\n\nНе упустите выгодную возможность раскрыть ИИ-бот на полную катушку! 🚀\n\nС уважением,\nкоманда ИИ-бота`)
    //     })
    // }
}