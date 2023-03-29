import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IProduct } from '../initializations/interfaces/initialization.interface';
import { IParseArticle } from './interfaces/product.interface';

@Injectable()
export class GetProductServiceService {

    async getProduct(article: string): Promise<IProduct> {
        const dataBase = 11
        const data = [];
        const image = await this.getProductImage(article)
        const parse = await this.parseStringArticles(article)

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

        return { ...data[0], image }
    }

    async getProductImage(articleId: string): Promise<string> {
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

    async parseStringArticles(data: string): Promise<IParseArticle> {
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
