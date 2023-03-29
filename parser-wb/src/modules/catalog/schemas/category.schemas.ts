import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import * as mongoose from "mongoose";
import { SubCategory } from "src/modules/sub-category/schemas/sub-category.schemas";

export type CategoriesDocument = mongoose.HydratedDocument<Category>

@Schema()
export class Category {

    @Prop()
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }] })
    sub_category: [SubCategory]
}


export const CategorySchema = SchemaFactory.createForClass(Category);
