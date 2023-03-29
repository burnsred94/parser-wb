import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

export type KeysDocument = mongoose.HydratedDocument<Keys>

@Schema()
export class Keys {
    _id: ObjectId

    @Prop()
    key: string;

    @Prop()
    count: number;
}

export const KeysSchema = SchemaFactory.createForClass(Keys);