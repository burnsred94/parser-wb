import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoriesDocument } from './schemas/category.schemas';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoriesDocument>) { }

    async addCategory(dto: string) {
        const category = await this.categoryModel.create({ name: dto });
        return category.save();
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
        return await this.categoryModel.findOne({ name: name})
    }
}
