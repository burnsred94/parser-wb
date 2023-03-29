import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { DtoSubCategory } from './dto/dto.interfaces';
import { SubCategory, SubCategoryDocument } from './schemas/sub-category.schemas';

@Injectable()
export class SubCategoryService {

    constructor(@InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>) { }

    async create(dto: DtoSubCategory) {
        return await this.subCategoryModel.create({ name: dto.name, category: dto.category });
    }

    async findById(id: Types.ObjectId) {
        return await this.subCategoryModel.findById({ _id: id })
    }

    async findByName(name: string) {
        return await this.subCategoryModel.findOne({ name: name })
    }

    async find(categoryID: Types.ObjectId) {
        return this.subCategoryModel.find({ categories: categoryID })
    }

    async updateKeys(id: Types.ObjectId, keyId: Schema.Types.ObjectId) {
        await this.subCategoryModel.findByIdAndUpdate(id, {
            $addToSet: { keys: [keyId] }
        })
    }

}
