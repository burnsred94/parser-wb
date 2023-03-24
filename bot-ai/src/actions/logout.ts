import { Action, Ctx, Update } from "nestjs-telegraf";
import { StatusUserBot, TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";


@Update()
export class UpdateLogout {

  constructor(private readonly sessionService: SessionsService) { }

  @Action("logout")
  async register(@Ctx() ctx: TelegrafContext) {
    const { id } = ctx.from

    const state = { state: ActionState.DEFAULT }
    await this.sessionService.updateOne(id, state)

    const statusUser = { statusUser: StatusUserBot.NOT_REGISTERED }
    await this.sessionService.updateOne(id, statusUser)
    
    await ctx.reply("Вы вышли из своего аккаунта\nПерезапустите бота для дальнейших действий")
  }
}