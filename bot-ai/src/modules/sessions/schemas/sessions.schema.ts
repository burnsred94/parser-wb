import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { Action, StatusUserBot } from "src/interfaces/telegraf-context.interfaces";
import { User } from "src/modules/user/schemas/user.schema";
import { CopywritingData, Stats } from "./interfaces/sessions.interfacs";





export type SessionDocument = mongoose.HydratedDocument<Session>

@Schema()
export class Session {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User

    @Prop({ required: true, default: (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) })
    date: string;

    @Prop({ type: String, default: Action['DEFAULT'], enum: Object.values(Action) })
    state: string;

    @Prop({ default: false })
    confirm: boolean;

    @Prop({ type: Types.DocumentArray<CopywritingData> })
    copywriting_data: CopywritingData[]

    @Prop({ type: String, default: StatusUserBot['REGISTERED_BOT'], enum: Object.values(StatusUserBot) })
    statusUser: number;

    @Prop({ type: Number })
    userId: number;

    @Prop({ type: Types.DocumentArray<Stats>})
    stats: Stats[]

}

export const SessionSchema = SchemaFactory.createForClass(Session);