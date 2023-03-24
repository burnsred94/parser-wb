import { ConsoleLogger } from "@nestjs/common/services";
import { Action, Ctx, Update } from "nestjs-telegraf";
import { StatusUserBot, TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";
import { StatsService } from "src/modules/stats/stats.service";

@Update()
export class UpdateReview {

    constructor(
        private readonly statsService: StatsService,
        private readonly sessionService: SessionsService,
        ) { }


    @Action('review')
    async menu(ctx: TelegrafContext) {

        const {id} = ctx.from

        const state = {state: ActionState.REVIEW}
        await this.sessionService.updateOne(id, state)

        
        await ctx.reply('<b>Оставте отзыв о работе нашего АI</b>\n\n <i>Он будет рад 🎊</i>',
            {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "⭐", callback_data: '/create-review/⭐' }, { text: "⭐⭐", callback_data: '/create-review/⭐⭐' }, { text: "⭐⭐⭐", callback_data: '/create-review/⭐⭐⭐' }],
                        [{ text: "⭐⭐⭐⭐", callback_data: "/create-review/⭐⭐⭐⭐" }, { text: "⭐⭐⭐⭐⭐", callback_data: "/create-review/⭐⭐⭐⭐⭐" }],
                    ]
                }
            })
    }

    @Action(/(?<=create-review\/).*/)
    async rating(@Ctx() ctx: TelegrafContext) {
        const rating = ctx.match.input.split('/')[2]

        await this.statsService.stats({
            reviews_or_copyright: rating.length,
        })

        await ctx.reply(`Спасибо за ваш отзыв 😊`)

        setTimeout(async () => {
            await ctx.reply(
                `Рады приветствовать вас сервисе <b>AI-копирайтинга</b> от <a href="https://sellershub.ru/?utm_medium=smm&utm_source=tg&utm_campaign=bot_ai&utm_term=bot_button&utm_content=1">Sellershub.ru</a>\n\nСервис использует <b>искусственный интеллект</b> для написания SEO-текста для описания товара <b>используя ваши ключи</b> для товара.\n\nМы обучаем нашу модель на базе товаров Wildberries`,
                {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🤖 AI - Копирайтер", callback_data: 'copywriter' }],
                            [{ text: "📟  Другие Сервисы", callback_data: 'services' }],
                            [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }],
                            [{ text: "🤝 Поддержка", callback_data: 'support' }]
                        ]
                    }
                })
        }, 3000)
    }
}