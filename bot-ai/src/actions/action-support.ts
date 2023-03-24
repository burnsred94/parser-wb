import { Action, Update } from "nestjs-telegraf";
import * as path from "path";
import * as fs from "fs"
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { StatsService } from "src/modules/stats/stats.service";
import { SessionsService } from "src/modules/sessions/sessions.service";

@Update()
export class UpdateActionSupport {

    constructor(private readonly statsService: StatsService,
        private readonly sessionService: SessionsService) { }

    @Action('support')
    async menu(ctx: TelegrafContext) {
        const { id } = ctx.from

        const state = { state: ActionState.SUPPORT }
        await this.sessionService.updateOne(id, state)

        const link = path.join(__dirname, '../../public/photo_2023-03-14_15-01-39.jpg')
        const sourceImg = fs.createReadStream(link)


        await this.statsService.stats({
            support_button: 1
        })


        await ctx.replyWithPhoto(
            { source: sourceImg },
            {
                caption: `Наша поддержка поможет вам с любым возникшим у вас вопросом\n\n`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "💬 Вопросы приобретения платных опций", url: "https://t.me/sellershub_m" }],
                        [{ text: "💬 Консультация по сотрудничеству и партнерским программам", url: "https://t.me/jlmr11" }],
                        [{ text: "💬 Вопросы, касаемые онлайн-каталога", url: "https://t.me/sellershub_m" }],
                        [{ text: "💬 Технические проблемы и неполадки", url: "https://t.me/Sellershub_support" }],
                        [{ text: "📋 Вернуться в меню", callback_data: "start" }, { text: "💬 Наши каналы и чаты", callback_data: "chats_and_chanels" }]
                    ]
                }
            })
    }
}