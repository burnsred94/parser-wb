import { Action, Update } from "nestjs-telegraf";
import * as path from "path";
import * as fs from "fs"
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActonEnum} from "src/interfaces/telegraf-context.interfaces";

@Update()
export class UpdateServices {

    @Action('services')
    async menu (ctx: TelegrafContext) {
        ctx.session.state = ActonEnum.DEFAULT;
        const link = path.join(__dirname, '../../public/Avd Banner 20.png')
        const sourceImg = fs.createReadStream(link)
        
        await ctx.replyWithPhoto(
            { source: sourceImg }, 
            { 
                caption: `Компания SellersHub разработала для вас сервисы:\n\n✔️AI-Копирайтинга - Сервис построенный на базе искуственного интелекта который геннерирует по ключам описание карточки товара\n\n✔️Трекер позиций товара WB - Сервис построенный на отслеживании позиций товара и выдаче ключей`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📈 Трекер позиций товара WB", callback_data: 'track_position' }],
                        [{ text: "🤖 Бот Каталога SellersHub", url: "https://t.me/sellershub_bot" }],
                        [{ text: "📋 Вернутся в меню", callback_data: "menu" }, { text: "🤝 Поддержка", callback_data: "support" }]
                    ]
                } 
            })
    }
}