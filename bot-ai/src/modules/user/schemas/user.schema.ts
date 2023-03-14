import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";


export type UserDocument = mongoose.HydratedDocument<User>

@Schema()
export class User {
    @Prop({type: "string",})
    id: string;

    @Prop({type: "string",})
    username: string;

    @Prop({type: "string"})
    password: string;

    @Prop({type: "string"})
    telegramUser: string;

    @Prop({default: false})
    confirmed: boolean;

    @Prop({type: 'string'})
    email: string;
  
    @Prop()
    articles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);