import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CategoryService } from './modules/catalog/catalog.service';
import { KeyOptimazationData, ParseArticle } from './interfaces/search.interfaces';
import { KeysGeneratorService } from './modules/keys-generator/keys-generator.service';
import { SubCategoryService } from './modules/sub-category/sub-category.service';
import { SearchService } from './modules/search/search.service';
import { Key } from './modules/keys-generator/intrerfaces/key.interface';
import { Types } from 'mongoose';


@Injectable()
export class AppService {

  constructor(
    private readonly keyService: KeysGeneratorService,
    private readonly searchService: SearchService,
    private readonly catologService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
  ) { }

  async findCategory(dto) {
    return await this.catologService.findCategory(dto);
  }

  async search(dto) {

    

    const parse = await this.parseStringArticles(dto.article)
    const data = await this.getData(parse)
    const checkSubCategory = await this.subCategoryService.findByName(data.dataQuery.subj_name)
    const img = await this.getImageProduct(dto.article)
    
    if (checkSubCategory !== null) {
      const result = await this.dataKeysOptimization(checkSubCategory.keys, true, dto.article)

      return {
        article: dto.article,
        img: img,
        product: {
          parentCategory: data.dataQuery.subj_root_name,
          subCategory: data.dataQuery.subj_name,
          name: data.dataQuery.imt_name,
        },
        keys: result
      }
    }else {
      const category = await this.catologService.addCategory(data.dataQuery.subj_root_name);
      const subCategory = await this.subCategoryService.addSubCategory({ name: data.dataQuery.subj_name, categories: category._id })
      category.categories.push(subCategory)
      category.save()

      const keys = await this.keyService.generatorKeys(data.dataQuery.description)

      const optimazation: Key[] = await this.dataKeysOptimization(keys, false, dto.article)

      subCategory.save()
      
      const result = this.dataSubCategoryKeysUpdate(optimazation, subCategory._id)

      return {
        article: dto.article,
        img: img,
        product: {
          parentCategory: data.dataQuery.subj_root_name,
          subCategory: data.dataQuery.subj_name,
          name: data.dataQuery.imt_name,
        },
        keys: result
      }

    }

  }


  private async getData(parse: ParseArticle) {
    const dataBase = 11
    const data = [];
    let image;

    for (let i = 1; i < dataBase; i++) {
      try {
        if (i < 10) {
          const iterator = '0' + String(i);
          const urlDataBase = `https://basket-${iterator}.wb.ru/vol${parse.vol}/part${parse.part}/${parse.article}/info/ru/card.json`;
          const dataCard = await axios.get(urlDataBase)

          if (dataCard.data !== undefined) {
            data.push(dataCard.data)
            break
          }

        } else {
          const urlDataBase = `https://basket-${i}.wb.ru/vol${parse.vol}/part${parse.part}/${parse.article}/info/ru/card.json`;
          const dataCard = await axios.get(urlDataBase)

          if (dataCard.data !== undefined) {
            data.push(dataCard.data)
            break
          }
        }

      } catch (e) {
        continue
      }
    }

    return { dataQuery: data[0], img: image }

  }

  async getImageProduct(articleId: string) {
    const parse = await this.parseStringArticles(articleId)

    for (let i = 0; i <= 10; i++) {
      const iterator = i < 10 ? '0' + String(i) : i;
      try {
        const utlImg = `https://basket-${iterator}.wb.ru/vol${parse.vol}/part${parse.part}/${parse.article}/images/big/1.jpg`;
        const img = await axios.get(utlImg)
        if (img.status === 200) {
          return utlImg
        }
      } catch (e) {
        continue
      }

    }

  }

  private async dataSubCategoryKeysUpdate(data:Key[] , id: Types.ObjectId) {
      try {
        data.flat().forEach(async(keyData) => {
          const key = await this.keyService.addKeys({ key: keyData.key, count: keyData.count })
          await this.subCategoryService.updateKeys(id, key._id)
        })

        return data.flat()
      }catch (e) {

      }
  }

  private async dataKeysOptimization(data: KeyOptimazationData , status: boolean, article?: string): Promise<Key[]> {
    try {
      const pr = []
      let i = 0

      if (status) {  
          pr.push(this.searchService.search(data, Number(article)))
      } else {
        while (data?.length > i) {
          i += 1
          pr.push(this.searchService.search(data[i], Number(article)))
        }

      }

      const result = await Promise.all(pr)

      return result
    } catch (e) {

    }
  }

  private async parseStringArticles(data: string): Promise<ParseArticle> {
    switch (data !== undefined) {
      case data.length === 4:
        return {
          vol: '0',
          part: data.substring(0, 1),
          article: data
        }
      case data.length === 5:
        return {
          vol: '0',
          part: data.substring(0, 2),
          article: data
        }
      case data.length === 6:
        return {
          vol: data.substring(0, 1),
          part: data.substring(0, 3),
          article: data
        }
      case data.length === 7:
        return {
          vol: data.substring(0, 2),
          part: data.substring(0, 4),
          article: data
        }
      case data.length === 8:
        return {
          vol: data.substring(0, 3),
          part: data.substring(0, 5),
          article: data
        }
      case data.length === 9:
        return {
          vol: data.substring(0, 4),
          part: data.substring(0, 6),
          article: data
        }
      case data.length === 10:
        return {
          vol: data.substring(0, 5),
          part: data.substring(0, 7),
          article: data
        }
    }
  }

}
