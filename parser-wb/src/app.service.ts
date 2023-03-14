import { Injectable } from '@nestjs/common';
import { CategoryService } from './modules/catalog/catalog.service';
import { KeyOptimazationData } from './interfaces/search.interfaces';
import { KeysGeneratorService } from './modules/keys-generator/keys-generator.service';
import { SubCategoryService } from './modules/sub-category/sub-category.service';
import { SearchService } from './modules/search/search.service';
import { Key } from './modules/keys-generator/intrerfaces/key.interface';
import { Types } from 'mongoose';
import { ArticleService } from './modules/article/article.service';
import { getImageProduct, parseStringArticles, getData, removeDuplicates } from './utils';
import { GetData } from './utils/interfaces/interfaces.getData';
import { CheckData, ResultDataInDB } from './interfaces/app-interfaces/service-app.interface';
import { uniqWith, chunk } from 'lodash'

@Injectable()
export class AppService {

  constructor(
    private readonly keyService: KeysGeneratorService,
    private readonly searchService: SearchService,
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly articleService: ArticleService
  ) { }

  async findCategory(dto) {
    return await this.categoryService.findCategory(dto);
  }

  async search(dto) {

    const parse = await parseStringArticles(dto.article)
    const data = await getData(parse)

    const checkDataInBd = await this.check(data, dto.article);

    if (checkDataInBd.category === null) {
      console.log("Checking 1: ", checkDataInBd)
      return await this.notCategory(data, dto.article);
    }

    if (checkDataInBd.category !== null && checkDataInBd.subCategory === null) {
      console.log("Checking 2: ", checkDataInBd)
      return await this.notSubCategory(data, dto.article, checkDataInBd.category);
    }
    
    // if (checkDataInBd.category !== null && checkDataInBd.subCategory !== null && checkDataInBd.article === null) {
    //   console.log("Checking 3: ", checkDataInBd)
    //   return await this.notArticles(data, dto.article, checkDataInBd.category, checkDataInBd.subCategory);
    // }

  }
  
  private async check(data: GetData, aritcle: string): Promise<CheckData> {
    const category = await this.categoryService.findByName(data.dataQuery.subj_root_name)
    const subCategory = await this.categoryService.findByName(data.dataQuery.subj_name)
    const article = await this.articleService.findByArticle(aritcle)

    return {
      category: category !== null ? category._id : null,
      subCategory: subCategory !== null ? subCategory._id : null,
      article: article !== null ? article._id : null
    }
  }

  // Когда у нас есть эта категория есть подкатегория и нет артикула
  // Когда у нас есть категория есть подкатегория и есть артикул
  //

  private async notCategory(data: GetData, article: string): Promise<ResultDataInDB> {
    try {
      const category = await this.categoryService.addCategory(data.dataQuery.subj_root_name);
      const subCategory = await this.subCategoryService.addSubCategory({ name: data.dataQuery.subj_name, categories: category._id });
      category.categories.push(subCategory);
      category.save()

      const keys = await this.keyService.generatorKeys(data.dataQuery.description);
      const rmDuplicates = uniqWith(keys);

      const arrKey = chunk(rmDuplicates, 50)
      const optimazation: Key[] = await this.dataKeysOptimization(arrKey, false, article);
      subCategory.save()

      const img = await getImageProduct(article)

      const keysResult = await this.dataSubCategoryKeysUpdate(optimazation, subCategory._id)


      return {
        article: article,
        img: img,
        product: {
          parentCategory: data.dataQuery.subj_root_name,
          subCategory: data.dataQuery.subj_name,
          name: data.dataQuery.imt_name,
          keys: keysResult
        },
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async notSubCategory(data: GetData, article: string, categoryId: Types.ObjectId): Promise<ResultDataInDB> {
    const subCategory = await this.subCategoryService.addSubCategory({ name: data.dataQuery.subj_name, categories: categoryId });
    const category = await this.categoryService.findById(categoryId);
    category.categories.push(subCategory)

    const keys = await this.keyService.generatorKeys(data.dataQuery.description);
    const rmDuplicates = uniqWith(keys)

    const arrKey = chunk(rmDuplicates, 50)
    const optimazation: Key[] = await this.dataKeysOptimization(arrKey, false, article);
    subCategory.save()

    const img = await getImageProduct(article)

    const keysResult = await this.dataSubCategoryKeysUpdate(optimazation, subCategory._id)

    return {
      article: article,
      img: img,
      product: {
        parentCategory: data.dataQuery.subj_root_name,
        subCategory: data.dataQuery.subj_name,
        name: data.dataQuery.imt_name,
        keys: keysResult
      },
    }
  }

  private async notArticles(data: GetData, article: string, categoryId: Types.ObjectId, subCategoryId: Types.ObjectId): Promise<ResultDataInDB> {
    await this.articleService.createArticle({article: article, sub_category: subCategoryId, category: categoryId});
    
    const { keys } = await this.subCategoryService.findById(subCategoryId);
    const generateKeys = await this.keyService.generatorKeys(data.dataQuery.description);
    const allKeys = keys.concat(generateKeys);
    const rmDuplicates = await removeDuplicates(allKeys.flat())

    const keysResult = await this.dataKeysOptimization(rmDuplicates, false, article);

    const img = await getImageProduct(article)

    return {
      article: article,
      img: img,
      product: {
        parentCategory: data.dataQuery.subj_root_name,
        subCategory: data.dataQuery.subj_name,
        name: data.dataQuery.imt_name,
        keys: keysResult
      },
    }
  }

  private async dataSubCategoryKeysUpdate(data: Key[], id: Types.ObjectId) {
    try {
      data.flat().forEach(async (keyData) => {
        const key = await this.keyService.addKeys({ key: keyData.key, count: keyData.count })
        await this.subCategoryService.updateKeys(id, key._id)
      })

      return data.flat()
    } catch (e) {

    }
  }

  private async dataKeysOptimization(data: KeyOptimazationData, status: boolean, article?: string): Promise<Key[]> {
    try {
      const pr = []
      let i = 0
      console.log(data.length)

      if (status) {
        pr.push(this.searchService.search(data, Number(article)))
      } else {
        while (data?.length > i) {
          console.log("Итереация", i)
          i += 1
          pr.push(this.searchService.search(data[i], Number(article)))
        }
      }

      const result = await Promise.all(pr)

      return result
    } catch (e) {

    }
  }
}
