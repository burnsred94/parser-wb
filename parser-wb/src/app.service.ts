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
import { uniqWith, chunk, compact } from 'lodash'
import { InitializationsService } from './modules/initializations/initializations.service';
import { Article } from './modules/initializations/interfaces/initialization.interface';
import { GeneratorDataService } from './modules/generator-data/generator-data.service';

@Injectable()
export class AppService {

  constructor(
    private readonly initService: InitializationsService,
    private readonly keyService: KeysGeneratorService,
    private readonly searchService: SearchService,
    private readonly categoryService: CategoryService,
    private readonly generatorDataInDb: GeneratorDataService
  ) { }

  async findCategory(dto: Article) {
    return await this.categoryService.findCategory(dto);
  }

  async search(dto: Article) {

    const product = await this.initService.init(dto)

    const find = await this.generatorDataInDb.findOne({ article: Number(dto.article) });

    if (find) {
      const { counter, instance } = find;
      return { instance, counter };
    } else {
      const keys = await this.keyService.generatorKeys(product.description);
      const rmDuplicates = uniqWith(keys)
      const chunks = chunk(rmDuplicates, 50)

      const dataG = await this.generatorDataInDb.create(
        {
          article: Number(dto.article),
          data_generation: chunks,
          counter: 0,
          instance: chunks.length,
          result: []
        })

      return { instance: dataG.instance, counter: dataG.counter };
    }
  }



  async getKeysInstance(article: Article,) {
    const find = await this.generatorDataInDb.findOne({ article: Number(article.article) });
    const keys = []
    let i = 0


    while (i < 100) {
      i += 1

      const data = this.searchService.search(find.data_generation[i], Number(article.article))
      keys.push(data)
    }
    const data = await Promise.all(keys)

    const result = compact(data.flat())
    console.log(result.length)
    return result
  }

}