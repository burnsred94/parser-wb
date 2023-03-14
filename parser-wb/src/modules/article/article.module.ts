import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { CategoryModule } from '../catalog/category.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Article.name, schema: ArticleSchema}]),
  CategoryModule,
  SubCategoryModule
],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService]
})
export class ArticleModule {}
