import { Types } from "mongoose";
import { CategoriesDocument } from "src/modules/catalog/schemas/category.schemas";

export class DtoSubCategory {
    name: string;
    category: CategoriesDocument
}