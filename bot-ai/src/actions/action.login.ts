import { Action, Ctx, Update } from "nestjs-telegraf";
import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionEnum } from "src/interfaces/telegraf-context.interfaces";


@Update()
export class UpdateRegister {

    @Action("login")
        async register(@Ctx() ctx: TelegrafContext) {
        ctx.session.state = ActionEnum.REGISTER  
        await ctx.sendMessage('Введитие ваш email 👇');
  }
}