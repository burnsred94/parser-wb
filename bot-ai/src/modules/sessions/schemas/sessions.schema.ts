import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { Action, StatusUserBot } from "src/interfaces/telegraf-context.interfaces";
import { User } from "src/modules/user/schemas/user.schema";
import { Copywriting } from "./copywrite-data.schema";
import { SessionStats } from "./sessions-stats.schema";





export type SessionDocument = mongoose.HydratedDocument<Session>

@Schema()
export class Session {
    id: number
    sStats = new SessionStats().createStatsSession()
    sCopywriting = new Copywriting().createCopywritingSession()

    constructor(id: number, user: User){
        this.userId = id;
        this.user = user;
        this.confirmed = user.confirmed;
        user.confirmed !== false ? this.statusUser = StatusUserBot.REGISTERED : this.statusUser = StatusUserBot.NOT_REGISTERED
    }

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User"})
    user: User

    @Prop({ required: true, default: (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) })
    date: string;

    @Prop({ type: String, default: Action.DEFAULT, enum: Object.values(Action) })
    state: string;

    @Prop({ default: false })
    confirmed: boolean;

    @Prop({ type: Object })
    copywriting_data = this.sCopywriting;

    @Prop({ type: String, enum: Object.values(StatusUserBot) })
    statusUser: number;

    @Prop({ type: Number })
    userId: number;

    @Prop({ type: Object })
    stats = this.sStats

}

export const SessionSchema = SchemaFactory.createForClass(Session);