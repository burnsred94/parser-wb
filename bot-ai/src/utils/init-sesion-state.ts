import { TelegrafContext } from "src/interfaces/telegraf-context.interfaces";

export const initState = async (ctx: TelegrafContext) => {
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    if(ctx.message){
        const user = ctx.message.from.username;
        ctx.session.user = user;
      }
    
    ctx.session.state = null;

    ctx.session.copywriting_data={
        description:'',
        keywords: '',
        name: '',
        tickDescription: false,
        tickKeywords: false,
        tickName: false,
    };

    ctx.session.stats = {
        date: date,
        start_bot: 0,
        channels_button: 0,
        success_registration: 0,
        support_button: 0,
        start_generation_button: 0,
        regenerate_button: 0,
        track_position_button: 0,
        reviews_or_copyright: []
    }
}