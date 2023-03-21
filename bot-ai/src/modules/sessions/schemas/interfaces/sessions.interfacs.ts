import { Types } from "mongoose";

export interface CopywritingData {
    _id: Types.ObjectId;
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