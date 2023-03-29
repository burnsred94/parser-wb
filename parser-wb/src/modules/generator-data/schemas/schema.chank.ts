import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";


export type GeneratorDataDocument = mongoose.HydratedDocument<GeneratorData>

@Schema()
export class GeneratorData {

    @Prop()
    article: number;

    @Prop()
    data_generation: [];

    @Prop({ type: Number, default: 0 })
    counter: number;

    @Prop({ type: Number })
    instance: number;

    @Prop()
    result: [];

}


export const GeneratorDataSchema = SchemaFactory.createForClass(GeneratorData);
