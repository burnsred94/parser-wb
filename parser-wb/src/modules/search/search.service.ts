import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { KeysGeneratorService } from 'src/modules/keys-generator/keys-generator.service';
import { removeDuplicates } from 'src/utils/removeDuplicates'; 
import { Article } from './interfaces/key-wb.interface';

@Injectable()
export class SearchService {

    constructor(private readonly keyService: KeysGeneratorService){}


    private async fetchPage(page: number, article: Article, code: string): Promise<{
        page: number,
        count: number,
        result: number | null
    }> {
        try {
            const searchUrl = `https://search.wb.ru/exactmatch/sng/common/v4/search?query=${code}&resultset=catalog&limit=100&sort=popular&page=${page}&appType=128&curr=byn&locale=by&lang=ru&dest=-59208&regions=1,4,22,30,31,33,40,48,66,68,69,70,80,83&emp=0&reg=1&pricemarginCoeff=1.0&offlineBonus=0&onlineBonus=0&spp=0`
            const { data: payload } = await axios.get(searchUrl)
            const result = payload.data.products.findIndex(product => product.id === article)

            return {
                page,
                count: payload.data.products.length,
                result: result
            }
        } catch (error) {

        }
    }

    async search(keys, article: Article) {
        const arr = [];


        if (typeof keys === 'undefined') return arr

        for (const item of keys) {
            const code = encodeURIComponent(item?.key)
            console.log(article)

            const data =
                [
                    this.fetchPage(1, article, code),
                    this.fetchPage(2, article, code),
                    this.fetchPage(3, article, code),
                    this.fetchPage(4, article, code),
                    this.fetchPage(5, article, code),
                ]


            const result = await Promise.all(data)
            
            const check = result.find(item => item?.result !== undefined && item?.result !== -1)
            if (check !== undefined) {
                const positionResult = check.page > 1 ? check.result : ((check.page * check.count) - check.count) + (check.result + 1)
                arr.push({ key: item.key, count: item.count, position: positionResult })
                console.log( {key: item.key, count: item.count} )
            }
        }

        const filterArrays = removeDuplicates(arr)

        return filterArrays
    }
}

