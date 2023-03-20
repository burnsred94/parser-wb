import { Action, Update } from "nestjs-telegraf";
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { StatsService } from "src/modules/stats/stats.service";

@Update()
export class UpdateTrackerPosition {

    constructor(private readonly statsService: StatsService){}

    @Action('track_position')
    async trackPosition (ctx: TelegrafContext) {

        ctx.session.stats.track_position_button += 1;

        await this.statsService.stats({
            track_position_button: ctx.session.stats.track_position_button
        })
        
        await ctx.reply(`<b>Сильно ждешь нашего релиза Ключемера позиций?</b>\n\nВсе будет совсем скоро а, пока что ты можешь найти исполнителя в нашем каталоге <a href='https://t.me/sellershub_bot'>SellersHub Bot Каталог</a>`,
            { 
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🤖 Бот Каталога SellersHub", url: "https://t.me/sellershub_bot" }],
                        [{ text: "📋 Вернутся в меню", callback_data: "menu" }, { text: "🤝 Поддержка", callback_data: "support" }]
                    ]
                } 
            })
    }
}