import { Types } from "mongoose";

export interface Key {
    key: string;
    count: number;
}

export interface Keys extends Key{
    _id?: Types.ObjectId
}