import { Action, Update } from "nestjs-telegraf";
import * as path from "path";
import * as fs from "fs"
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";

@Update()
export class UpdateServices {

    constructor(private readonly sessionService: SessionsService) { }

    @Action('services')
    async menu(ctx: TelegrafContext) {
        const { id } = ctx.from

        const link = path.join(__dirname, '../../public/Avd Banner 20.png')
        const sourceImg = fs.createReadStream(link)

        const state = { state: ActionState.SERVICES }
        await this.sessionService.updateOne(id, state)

        await ctx.replyWithPhoto(
            { source: sourceImg },
            {
                caption: `Компания SellersHub разработала для вас сервисы:\n\n✔️AI-Копирайтинга - Сервис построенный на базе искуственного интелекта который геннерирует по ключам описание карточки товара\n\n✔️Трекер позиций товара WB - Сервис построенный на отслеживании позиций товара и выдаче ключей`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📈 Трекер позиций товара WB", callback_data: 'track_position' }],
                        [{ text: "🤖 Бот Каталога SellersHub", url: "https://t.me/sellershub_bot" }],
                        [{ text: "📋 Вернуться в меню", callback_data: "start" }, { text: "🤝 Поддержка", callback_data: "support" }]
                    ]
                }
            })
    }
}