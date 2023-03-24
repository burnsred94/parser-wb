import { Action, Ctx, Update } from "nestjs-telegraf";
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionState } from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";


@Update()
export class UpdateLogin {


  @Action("not_access")
  async register(@Ctx() ctx: TelegrafContext) {

    await ctx.sendMessage('Вы еще не подтвердили свои данные\n\nАвторизуйтесь в системе')

  }
      
}