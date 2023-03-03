import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { DtoParentCategory } from './dto/dto.interfaces';
import { SubCategory, SubCategoryDocumnet } from './schemas/sub-category.schemas';

@Injectable()
export class SubCategoryService {

    constructor(@InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocumnet>) { }

    async addSubCategory(dto: DtoParentCategory) {
        return await this.subCategoryModel.create({ name: dto.name, categories: dto.categories });
    }

    async findById(id: Types.ObjectId) {
        return await this.subCategoryModel.findById({_id: id}).populate('keys')
    }

    async findByName(name: string) {
        return await this.subCategoryModel.findOne({name: name}).populate('keys')
    }

    async find(categoryID: Types.ObjectId) {
        return this.subCategoryModel.find({ categories: categoryID })
    }

    async updateKeys(id: Types.ObjectId, keyId: Schema.Types.ObjectId){
        await this.subCategoryModel.findByIdAndUpdate(id, {
            $addToSet: { keys:[keyId] }
        })
    }
    
}
