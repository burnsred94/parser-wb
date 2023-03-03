import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { SubCategory } from "src/modules/sub-category/schemas/sub-category.schemas";

export type CategoriesDocument = mongoose.HydratedDocument<Category>

@Schema()
export class Category {
    @Prop()
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'}] })
    categories: [SubCategory]
}


export const CategorySchema = SchemaFactory.createForClass(Category);
