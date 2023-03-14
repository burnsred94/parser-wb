import { Action, Update } from "nestjs-telegraf";
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActonEnum} from "src/interfaces/telegraf-context.interfaces";

@Update()
export class UpdateAiCopyWrite {

    @Action('copywriter')
    async soft (ctx: TelegrafContext) {
        ctx.session.state = ActonEnum.AI_COPYWRITER;
        await ctx.reply('<b>Введите название товара</b>\n\n<i>например "куртка женская surio"</i>', {
            parse_mode: 'HTML'
        })
        ctx.session.copywriting_data={
            description:'',
            keywords: '',
            name: '',
            tickDescription: false,
            tickKeywords: false,
            tickName: false,
        };
    }
}