import { ParseArticle } from "src/interfaces/search.interfaces"

export const parseStringArticles = async (data: string): Promise<ParseArticle> => {
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
