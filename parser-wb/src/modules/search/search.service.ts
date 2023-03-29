import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { Article } from './interfaces/key-wb.interface';

@Injectable()
export class SearchService {

    constructor(private readonly gotService: GotService) { }


    private async fetchPage(page: number, article: Article, code: string): Promise<{
        page: number,
        count: number,
        result: number | null
    }> {
        try {
            const searchUrl = `https://search.wb.ru/exactmatch/sng/common/v4/search?query=${code}&resultset=catalog&limit=100&sort=popular&page=${page}&appType=128&curr=byn&locale=by&lang=ru&dest=-59208&regions=1,4,22,30,31,33,40,48,66,68,69,70,80,83&emp=0&reg=1&pricemarginCoeff=1.0&offlineBonus=0&onlineBonus=0&spp=0`
            const response = await this.gotService.gotRef(searchUrl)
            const payload = JSON.parse(response.body)
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

            const data =
                [
                    this.fetchPage(1, article, code),
                    this.fetchPage(2, article, code),
                    this.fetchPage(3, article, code),
                ]


            const result = await Promise.all(data)

            const check = result.find(item => item?.result !== undefined && item?.result !== -1)

            if (check !== undefined) {
                console.log(check)
                const positionResult = check.page > 1 ? check.result : ((check.page * check.count) - check.count) + (check.result + 1)
                arr.push({ key: item.key, count: item.count, position: positionResult })
            }
        }


        return arr
    }

}

