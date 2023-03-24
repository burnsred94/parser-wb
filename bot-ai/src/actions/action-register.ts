import { Action, Ctx, Update } from "nestjs-telegraf";
import { Action as ActionState, StatusUserBot, TelegrafContext } from "src/interfaces/telegraf-context.interfaces";
import { Action as ActionEnum } from "src/interfaces/telegraf-context.interfaces";
import { SessionsService } from "src/modules/sessions/sessions.service";


@Update()
export class UpdateRegister {

  constructor(private readonly sessionService: SessionsService) {}

    @Action("register")
        async register(@Ctx() ctx: TelegrafContext) {
          const {id} = ctx.from

        const state = {state: ActionState.REGISTER}
        const stateUp = await this.sessionService.updateOne(id, state)

        if(stateUp) {
          await ctx.sendMessage('<i>Ваша электронная почта должна быть достоверной, так как вам нужно будет подтвердить ее после регистрации</i>\n\n<b>Введитие ваш email</b> 👇', { parse_mode: 'HTML' });
        }
  }
}