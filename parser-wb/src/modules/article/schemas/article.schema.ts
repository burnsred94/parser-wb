import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Category } from "src/modules/catalog/schemas/category.schemas";
import { SubCategory } from "src/modules/sub-category/schemas/sub-category.schemas";

export type ArticleDocument = mongoose.HydratedDocument<Article>

@Schema()
export class Article {
    @Prop()
    article: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' })
    sub_category: SubCategory;

}


export const ArticleSchema = SchemaFactory.createForClass(Article);
