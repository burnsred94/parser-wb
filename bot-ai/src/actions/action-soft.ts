import { Action, Update } from "nestjs-telegraf";
import { StatusUserBot, TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { CopywritingService } from "src/modules/sessions/schemas/copywrite-data.schema";
import { SessionsService } from "src/modules/sessions/sessions.service";
import { UserService } from "src/modules/user/user.service";

@Update()
export class UpdateAiCopyWrite {

    constructor(
        private readonly sessionService: SessionsService,
        private readonly userService: UserService,
    ) { }

    @Action('copywriter')
    async copywriterInit(ctx: TelegrafContext) {

        const { id } = ctx.from
        const session = await this.sessionService.findOne(id)

        if (session.statusUser === StatusUserBot.REGISTER_BOT_SITE) {

            const symbols = await this.userService.findByTelegramId(id)

            if (symbols.generateSymbol <= 0) {
                const state = { state: ActionState.DEFAULT }
                await this.sessionService.updateOne(id, state)

                await ctx.reply('К сожалению у вас закончились символы\n\nВы можете пополнить их нажав на кнопку ниже', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Пополнить 💊 ', url: 'https://t.me/evgeniy_sellershub_ru' }],
                            [{ text: "🔙 Вернуться в меню", callback_data: 'start' }]
                        ]
                    }
                })

            } else {
                const state = { state: ActionState.AI_COPYWRITER }
                await this.sessionService.updateOne(id, state)



                const defaultSession = new CopywritingService().createCopywritingSession();
                await this.sessionService.updateCopywriterData(id, defaultSession);


                await ctx.reply('<b>Введите название товара</b>\n\n<i>например "куртка женская surio"</i>', {
                    parse_mode: 'HTML'
                })
            }

        } else {
            await ctx.reply('Вы не авторизованны в сервисе\nПожалуйста авторизуйтесь')
        }


    }
}