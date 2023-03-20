import { Action, Update } from "nestjs-telegraf";
import * as path from "path";
import * as fs from "fs"
import { StatusUserBot, TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActonEnum} from "src/interfaces/telegraf-context.interfaces";

@Update()
export class UpdateMenuCopyWrite {

    @Action('menu')
    async menu (ctx: TelegrafContext) {
        ctx.session.state = ActonEnum.DEFAULT;
        ctx.session.confirm

        const link = path.join(__dirname, '../../public/Banner.png')
        const sourceImg = fs.createReadStream(link)

        const statusConfirmed = ctx.session.statusUser === StatusUserBot['REGISTERED_BOT'] || ctx.session.statusUser === StatusUserBot['REGISTER_BOT_SITE']

        await ctx.replyWithPhoto(
            { source: sourceImg }, 
            { 
                caption: `Рады приветствовать вас сервисе <b>AI-копирайтинга</b> от <a href="https://sellershub.ru/?utm_medium=smm&utm_source=tg&utm_campaign=bot_ai&utm_term=bot_button&utm_content=1">Sellershub.ru</a>\n\nСервис использует <b>искусственный интеллект</b> для написания SEO-текста для описания товара <b>используя ваши ключи</b> для товара.\n\nМы обучаем нашу модель на базе товаров Wildberries`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: statusConfirmed ? [
                        [{ text: "🤖 AI - Копирайтер", callback_data: 'copywriter' }],
                        [{ text: "📟  Другие Сервисы", callback_data: 'services' }],
                        [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }],
                        [{ text: "🤝 Поддержка", callback_data: 'support' }]
                    ] : [
                        [{ text: "📑 Регистрация", callback_data: 'register' }],
                        [{ text: "🤝 Поддержка", callback_data: 'support' }],
                        [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }]
                    ]
                } 
            })
    }
}