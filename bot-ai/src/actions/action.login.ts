import { Action, Ctx, Update } from "nestjs-telegraf";
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";


@Update()
export class UpdateLogin {

  constructor(private readonly sessionService: SessionsService) { }

  @Action("login")
  async register(@Ctx() ctx: TelegrafContext) {
    const { id } = ctx.from

    const state = { state: ActionState.LOGIN }
    await this.sessionService.updateOne(id, state)
    await ctx.sendMessage('Если вы уже зарегистрированны на нашем сайте SellersHub\nВы можете ввести свои данные ниже для авторизации\n\nEmail:\n<i>exemple@mail.to</i>\n\nPassword:\n<i>eXEMp1ePa11w0rD</i>',
      {
        parse_mode: 'HTML',
      }
    );
    setTimeout(async () => {
      await ctx.sendMessage('Введите ваш имейл ниже 👇')
    }, 1500)
  }
}