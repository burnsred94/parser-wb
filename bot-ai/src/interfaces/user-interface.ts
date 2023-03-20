import { Update } from "telegraf/typings/core/types/typegram";

type IUser = Update & {
    from: {
        id: number,
        is_bot: boolean,
        first_name: string,
        username: string,
        language_code: string
    }
}