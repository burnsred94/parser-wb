import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDtoArticle } from './dto/create-dto.article';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticleService {

    constructor(@InjectModel(Article.name) private articleRepository: Model<ArticleDocument>){}

    async findByArticle(article: string): Promise<ArticleDocument> {
        return await this.articleRepository.findOne({article: article})
    }

    async createArticle(data: CreateDtoArticle): Promise<ArticleDocument> {
        const article =  await this.articleRepository.create({
            article: data.article,
            sub_category: data.sub_category,
            category: data.category,
        });
        return article
    }

}
