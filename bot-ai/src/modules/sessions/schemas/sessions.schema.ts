import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { Action, StatusUserBot } from "src/interfaces/telegraf-context.interfaces";
import { User } from "src/modules/user/schemas/user.schema";
import { CopywritingService } from "./copywrite-data.schema";
import { LoginSession } from "./session-login.schema";
import { SessionStats } from "./sessions-stats.schema";





export type SessionDocument = mongoose.HydratedDocument<Session>

@Schema()
export class Session {
    id: number
    sStats = new SessionStats().createStatsSession()
    sCopywriting = new CopywritingService().createCopywritingSession()
    sLogin = new LoginSession().createDataSetLogin()

    constructor(id: number, user: User) {
        console.log(user)
        this.userId = id;
        this.user = user;
        this.confirmed = user !== null ? user.confirmed : false;
        this.confirmed !== false ? this.statusUser = StatusUserBot.REGISTERED_BOT : this.statusUser = StatusUserBot.NOT_REGISTERED
    }

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User

    @Prop({ required: true, default: (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) })
    date: string;

    @Prop({ type: Number, default: Action.DEFAULT })
    state: number;

    @Prop({ default: false })
    confirmed: boolean;

    @Prop({ type: Object })
    copywriting_data = this.sCopywriting;

    @Prop({ type: Number, enum: StatusUserBot })
    statusUser: number;

    @Prop({ type: Number })
    userId: number;

    @Prop({ type: Object })
    stats = this.sStats

    @Prop({ type: Object })
    login = this.sLogin

}

export const SessionSchema = SchemaFactory.createForClass(Session);