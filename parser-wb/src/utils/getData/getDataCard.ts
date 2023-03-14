import { ParseArticle } from "src/interfaces/search.interfaces";
import axios from "axios";
import { GetData } from "../interfaces/interfaces.getData";


export const getData = async (parse: ParseArticle): Promise<GetData> => {
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
