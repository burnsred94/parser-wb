import { Category } from "src/modules/catalog/schemas/category.schemas";
import { SubCategory } from "src/modules/sub-category/schemas/sub-category.schemas";

export class CreateDtoArticle {
    article: string;
    categories: Category;
    sub_category: SubCategory;
}