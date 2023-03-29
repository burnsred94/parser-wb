import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategoryDocument } from '../sub-category/schemas/sub-category.schemas';
import { Category, CategoriesDocument } from './schemas/category.schemas';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoriesDocument>) { }

    async create(dto: string) {
        return await this.categoryModel.create({ name: dto });
    }

    async findCategory(categories) {
        return await this.categoryModel.findOne({
            name: categories.name,
            populate: "parentcategories"
        })
    }

    async findById(id) {
        return this.categoryModel.findById(id)
    }

    async findByName(name) {
        return await this.categoryModel.findOne({ name: name })
    }

    async findOneByAll(name: string) {
        return await this.categoryModel.findOne({ name: name, populate: ['parent'] })
    }

    async updateSubCategory(data: { name: string, sub_category: Partial<SubCategoryDocument> }): Promise<void> {
        await this.categoryModel.findOneAndUpdate({ name: data.name }, { $push: { sub_category: data.sub_category } }, { new: true })
    }
}
