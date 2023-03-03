import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { readFileSync } from 'fs';
import { Model } from 'mongoose';
import { parse } from 'papaparse';
import { CategoryService } from 'src/catalog/catalog.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { Key } from './intrerfaces/key.interface';
import { Keys, KeysDocumnet } from './schemas/key.schema';

@Injectable()
export class KeysGeneratorService {

    constructor(
        @InjectModel(Keys.name) private keysModel: Model<KeysDocumnet>,
        private readonly subCategory: SubCategoryService,
        private readonly category: CategoryService

    ) { }


    async generatorKeys(text: string) {
        const record = [];
        const keys = []
        const data = readFileSync('storage/data.csv');
        const csvData = data.toString();

        const dataParse = await parse(csvData, {
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => results.data
        })



        dataParse.data.map((value) => {
            record.push({ key: value[0], count: value[1] })
        })

        record.map((value) => {
            try {
                if (typeof value.key === 'string') {
                    value.key.split(' ').forEach((i) => {
                        if (text.indexOf(i) !== -1 && i.length > 3) {
                            keys.push(value)
                        }
                    })
                }
            } catch (err) {

            }
        })


        const size = String(keys.length).slice(0, 3)
        const array = [], result = [], length = Math.ceil(keys.length / Number(size));
        for (let x = 0; x <= keys.length; x++) array.push(keys[x]);
        while (array.length) result.push(array.splice(0, length));

        return result
    }

    async addKeys(key: Key) {
        const newKey = await this.keysModel.create(key);
        return newKey.save()
    }
        
    // async getKeysParentCategory(id: string) {
    //     console.log("id:", id);

    //     const subCategory = await this.subCategory.findById(id)
    //     console.log("subCategory:", subCategory);

    //     const mainCategory = await this.category.findById(subCategory.category)
    //     const keysSet = new Set()

    //     mainCategory.categories.map(subCategory => {
    //         const keys = subCategory.keys
    //         keysSet.add(...keys)
    //     })

    //     return keysSet
    // }

}
