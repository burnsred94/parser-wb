import { Context } from "telegraf";

export enum Action {
    REGISTER = 'register',
    AI_COPYWRITER = 'copywriter',
    SUPPORT = 'support',
    CHAT_AND_CHANNELS = 'chatAndChannels',
    REGISTER_SUCCESS = 'registerSuccess',
    DEFAULT = 'null',
}

export enum StatusUserBot {
    NOT_REGISTERED,
    NOT_REGISTERED_BOT,
    REGISTERED,
    REGISTERED_BOT,
    REGISTER_BOT_SITE
}

export interface TelegrafContext extends Context {
    match: {
        input: string;
    },
    session: {
        state: Action;
        user: string;
        statusUser: StatusUserBot;
        confirm: boolean;
        chatId: number;
        copywriting_data: {
            name: string,
            description: string,
            keywords: string,
            tickName: boolean,
            tickDescription: boolean
            tickKeywords: boolean
        }
        stats: {
            date: string,
            start_bot: number,
            channels_button: number,
            success_registration: number,
            support_button: number,
            start_generation_button: number,
            regenerate_button: number,
            track_position_button: number,
            reviews_or_copyright: number[]

        }
    }
}