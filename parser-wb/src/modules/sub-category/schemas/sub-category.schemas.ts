import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Keys } from "src/modules/keys-generator/schemas/key.schema";
import { Category } from "src/modules/catalog/schemas/category.schemas";

export type SubCategoryDocument = mongoose.HydratedDocument<SubCategory>

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