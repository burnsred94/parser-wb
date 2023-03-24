import { Action, Update } from "nestjs-telegraf";
import * as path from "path";
import * as fs from "fs"
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState} from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";
import { StatsService } from "src/modules/stats/stats.service";

@Update()
export class UpdateChats {

    constructor(private readonly sessionService: SessionsService,
        private readonly statsService: StatsService) {}

    @Action('chats_and_chanels')
    async menu (ctx: TelegrafContext) {
        const link = path.join(__dirname, '../../public/Avd Banner 19.png')
        const sourceImg = fs.createReadStream(link)

        const {id} = ctx.from

        const state = {state: ActionState.CHAT_AND_CHANNELS}
        await this.sessionService.updateOne(id, state)

        await this.statsService.stats({
            our_channels_button: 1
        })

        await ctx.replyWithPhoto(
            { source: sourceImg }, 
            { 
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "💬 Инфографика для маркетплейсов от Селлерсхаб", url: 'https://t.me/sellershub_design' }],
                        [{ text: "💬 Менеджеры ЛК от Селлерсхаб", url: "https://t.me/sellershub_managers" }],
                        [{ text: "💬 Хаб селлеров WB и Озон", url: "https://t.me/SellersHUBofficial" }],
                        [{ text: "💬 Официальный канал SellersHub", url: "https://t.me/sellershubwow" }],
                        [{ text: "💬 Чат AI-копирайтинг от Селлерсхаб", url: "https://t.me/Sellershub_bot_ai" }],
                        [{ text: "📋 Вернутся в меню", callback_data: "start" }, { text: "🤝 Поддержка", callback_data: "support" }]
                    ]
                } 
            })
    }
}