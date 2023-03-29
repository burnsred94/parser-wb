import { ArticleDocument } from "src/modules/article/schemas/article.schema";
import { CategoriesDocument } from "src/modules/catalog/schemas/category.schemas";
import { SubCategoryDocument } from "src/modules/sub-category/schemas/sub-category.schemas";

export interface Article {
    article: string
}


export interface IFcCheck {
    findCategory: { state: CategoriesDocument | null, name: string };
    findSubCategory: { state: SubCategoryDocument | null, name: string };
    findArticle: { state: ArticleDocument | null, name: string };
}

export interface IProduct {
    imt_id: number
    nm_id: number
    imt_name: string
    subj_name: string
    subj_root_name: string
    vendor_code: string
    season: string
    kinds: string[]
    description: string
    grouped_options: GroupedOption[]
    options: Option[]
    compositions: Composition[]
    sizes_table: SizesTable
    certificate: Certificate
    nm_colors_names: string
    colors: number[]
    contents: string
    full_colors: FullColor[]
    selling: Selling
    media: Media
    data: Data
    image: string
}

export interface GroupedOption {
    group_name: string
    options: Option[]
}

export interface Option {
    name: string
    value: string
}

export interface Composition {
    name: string
}

export interface SizesTable {
    details_props: string[]
    values: Value[]
}

export interface Value {
    tech_size: string
    chrt_id: number
    details: string[]
    skus: string[]
}

export interface Certificate {
    verified: boolean
}

export interface FullColor {
    nm_id: number
}

export interface Selling {
    brand_name: string
    supplier_id: number
}

export interface Media {
    has_video: boolean
    photo_count: number
}

export interface Data {
    subject_id: number
    subject_root_id: number
    chrt_ids: number[]
}
