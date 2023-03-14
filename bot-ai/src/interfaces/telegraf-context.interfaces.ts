import { Context } from "telegraf";

export enum Action {
    REGISTER = 'register',
    AI_COPYWRITER = 'copywriter',
    SUPPORT = 'support',
    CHAT_AND_CHANNELS = 'chatAndChannels',
    DEFAULT = 'null',
}

export interface TelegrafContext extends Context {
    match: {
        input: string;
    },
    session: {
        state: Action;
        confirm: boolean;
        copywriting_data:{
            name:string,
            description:string,
            keywords:string,
            tickName:boolean,
            tickDescription:boolean
            tickKeywords:boolean
        }
    }
}