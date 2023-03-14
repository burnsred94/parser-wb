import { Action, Update } from "nestjs-telegraf";
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActonEnum} from "src/interfaces/telegraf-context.interfaces";

@Update()
export class UpdateReview {

    @Action('review')
    async menu (ctx: TelegrafContext) {
        ctx.session.state = ActonEnum.DEFAULT;
        await ctx.reply('<b>Оставте отзыв о работе нашего АI</b>\n\n <i>Он будет рад 🎊</i>',
            { 
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "⭐", callback_data: 'menu' },{ text: "⭐⭐", callback_data: 'menu' },{ text: "⭐⭐⭐", callback_data: 'menu' }],
                        [{ text: "⭐⭐⭐⭐", callback_data: "menu" }, { text: "⭐⭐⭐⭐⭐", callback_data: "menu" }],
                    ]
                } 
            })
    }
}