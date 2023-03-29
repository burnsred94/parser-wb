import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGeneratorData } from './interfaces/generator-data.interface';
import { GeneratorData, GeneratorDataDocument } from './schemas/schema.chank';

@Injectable()
export class GeneratorDataService {

    constructor(@InjectModel(GeneratorData.name) private readonly _generatorData: Model<GeneratorDataDocument>) { }

    async findOne(data: Partial<IGeneratorData>): Promise<GeneratorData> {

        return await this._generatorData.findOne({ article: data.article });
    }

    async create(data: IGeneratorData): Promise<GeneratorData> {
        const find = await this.findOne({ article: data.article })
        if (find) {
            return find;
        } else {

            return await this._generatorData.create(data);
        }
    }

    async updateResult(data: Partial<IGeneratorData>): Promise<GeneratorData> {
        return await this._generatorData.findOneAndUpdate({ article: data.article }, { $push: { result: data.result } });
    }

    async updateCounter(data: Partial<IGeneratorData>): Promise<void> {
        await this._generatorData.findOneAndUpdate({ article: data.article }, { $inc: { counter: 1 } });
    }

    async delete(data: Partial<IGeneratorData>): Promise<void> {
        await this._generatorData.findOneAndDelete({ article: data.article });
    }

}
