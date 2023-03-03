import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Category } from "src/catalog/schemas/category.schemas";
import { Keys } from "src/keys-generator/schemas/key.schema";

export type SubCategoryDocumnet = mongoose.HydratedDocument<SubCategory>

@Schema()
export class SubCategory {

    @Prop()
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Keys' }] })
    keys: [Keys]
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);