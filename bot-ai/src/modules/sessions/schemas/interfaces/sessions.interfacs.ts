import { Types } from "mongoose";
import { User } from "src/modules/user/schemas/user.schema";

export interface CopywritingData {
    description: string,
    keywords: string,
    name: string,
    tickDescription: boolean,
    tickKeywords: boolean,
    tickName: boolean
}

export interface Stats {
    start_bot: number,
    channels_button: number,
    success_registration: number,
    support_button: number,
    start_generation_button: number,
    regenerate_button: number,
    track_position_button: number,
    reviews_or_copyright: number[]
}

export interface Login extends User {
    email: string;
    password: string;
    tickEmail: boolean;
    tickPassword: boolean;
    isLogin: boolean;    
}