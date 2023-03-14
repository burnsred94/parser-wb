import { Schema, Types } from "mongoose";

export class CreateDtoArticle {
    article: string;
    category: Types.ObjectId;
    sub_category: Types.ObjectId;
}