import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchService } from './modules/search/search.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { KeysGeneratorModule } from './modules/keys-generator/keys-generator.module';
import { SearchModule } from './modules/search/search.module';
import { CategoryModule } from './modules/catalog/category.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { ArticleModule } from './modules/article/article.module';
import { GotModule } from '@t00nday/nestjs-got';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './parser-wb/.env'
  }),
  DatabaseModule,
  KeysGeneratorModule,
  SearchModule,
  CategoryModule,
  SubCategoryModule,
  ArticleModule,
  GotModule,
],
  controllers: [AppController],
  providers: [AppService, SearchService],
})
export class AppModule {}
