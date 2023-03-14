import axios from "axios";
import { parseStringArticles } from "../parseArticles";

export const getImageProduct = async (articleId: string) => {
    const parse = await parseStringArticles(articleId)

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