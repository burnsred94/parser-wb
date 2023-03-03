import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { urlCatalog } from 'src/constants/url.constants';
import { CatalogDto } from './dto/catalog.dto';
import { Catalog } from './interfaces/catalog.interface';

@Injectable()
export class CatalogWbService {
  constructor(private readonly httpService: HttpService) { }

  async getDataCatalog(dto: CatalogDto) {
    const { data: payload } = await axios.get(urlCatalog)
    return await this.getParentCatagory(payload.data, dto)
  }

  async getParentCatagory(payload: [Catalog], dto: CatalogDto) {
    const data = []
    const parentData = []
    payload.map((catagory) => {
      data.push({ name: catagory.name, id: catagory.id })
      if (typeof catagory.nodes === 'object') {
        for (const value of catagory.nodes) {
          parentData.push({ name: value.name, id: value.id, query: value.query, shardKey: value.shardKey, rawQuery: value.rawQuery });
        }
      }
    })


    await this.getFindArticlesAllCategory(parentData, dto)

  }

  async getFindArticlesAllCategory(data, dto: CatalogDto) {
    for (const value of data) {
      const url = `https://catalog.wb.ru/catalog/${value.shardKey}/catalog?${value.query}&limit=100&sort=popular&page=1&appType=128&curr=byn&locale=by&lang=ru&dest=-59208&regions=1,4,22,30,31,33,40,48,66,68,69,70,80,83&emp=0&reg=1&pricemarginCoeff=1.0&offlineBonus=0&onlineBonus=0&spp=0`
      const { data: products } = await axios.get(url);
      console.log(products.data)

    }
  }


  async search(dto) {
    const url: string = dto.url
    const code = encodeURIComponent(url)
    let page = 1
    let result = 0

    if (dto.region === 'BY') {
      do {
        const searchUrl = `https://search.wb.ru/exactmatch/sng/common/v4/search?query=${code}&resultset=catalog&limit=100&sort=popular&page=${page}&appType=128&curr=byn&locale=by&lang=ru&dest=-59208&regions=1,4,22,30,31,33,40,48,66,68,69,70,80,83&emp=0&reg=1&pricemarginCoeff=1.0&offlineBonus=0&onlineBonus=0&spp=0`
        const { data: payload } = await axios.get(searchUrl)
        console.log(payload)
        page += 1;
        result = payload.data.products.findIndex(product => product.id === dto.article)
        console.log(result)
      } while (result === -1)
    }

    if (dto.region === "RU") {
      do {
        const searchUrl = `https://search.wb.ru/exactmatch/ru/common/v4/search?appType=1&couponsGeo=12,3,18,15,21&curr=rub&dest=-1257786&emp=0&lang=ru&locale=ru&page=2&pricemarginCoeff=1.0&query=${code}&reg=0&regions=80,64,38,4,83,33,68,70,69,30,86,75,40,1,22,66,31,48,110,71&resultset=catalog&sort=popular&spp=0&suppressSpellcheck=false&page=${page}`
        const { data: payload } = await axios.get(searchUrl)
        page += 1;
        result = payload.data.products.findIndex(product => product.id === dto.article)
      } while (result === -1)
    }
    const res = (result +1 )+ (((page - 1) * 100) - 100)

    return {
      rankingIndex: res
    }
  }

}
