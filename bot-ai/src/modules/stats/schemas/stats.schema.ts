import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";


export type StatsDocument = mongoose.HydratedDocument<Stats>

@Schema()
export class Stats {
    @Prop({ required: true, default: (`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`) })
    date: string;

    @Prop({required: true, type: 'Number', default: 0})
    start_bot: number;

    @Prop({required: true, type: 'Number', default: 0})
    our_channels_button: number;

    @Prop({required: true, type: 'Number', default: 0})
    success_registration: number;

    @Prop({required: true, type: 'Number', default: 0})
    support_button: number;
    
    @Prop({required: true, type: 'Number', default: 0})
    start_generation_button: number;

    @Prop({required: true, type: 'Number', default: 0})
    regenerate_button: number;

    @Prop({required: true, type: 'Number', default: 0})
    track_position_button: number;

    @Prop({required: true, default: []})
    reviews_or_copyright: number[]

}

export const StatsSchema = SchemaFactory.createForClass(Stats);