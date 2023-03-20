import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Update } from 'nestjs-telegraf';
import { Telegram } from 'telegraf';

export class TaskManager {
    constructor(
        private readonly bot: Telegram,
        private readonly userId: number
    ) {
    }

    async messageEmailRegister() {
        console.log(this.userId);
        await this.bot.sendMessage(this.userId, 'Вы еще не подтвердили свой емейл \n что бы пользвоаться сервисом,\n пожалуйста подтвердите его.');
    }
}

export class TaskManagerService {
    bot: Telegram;
    configService: ConfigService
    userId: number;



    constructor() {
        this.configService = new ConfigService();
        this.bot = new Telegram(this.configService.get('TOKEN_DEV_TELEGRAM'));
    }

    fabric(userId: number): TaskManager {
        return new TaskManager(this.bot, userId);
    }
}
