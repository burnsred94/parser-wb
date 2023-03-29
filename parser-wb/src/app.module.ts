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
import { GeneratorDataService } from './modules/generator-data/generator-data.service';
import { GeneratorDataModule } from './modules/generator-data/generator-data.module';
import { InitializationsService } from './modules/initializations/initializations.service';
import { InitializationsModule } from './modules/initializations/initializations.module';
import { GetProductServiceService } from './modules/get-product-service/get-product-service.service';
import { GetProductServiceModule } from './modules/get-product-service/get-product-service.module';

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
    InitializationsModule,
    GetProductServiceModule,
    GeneratorDataModule
  ],
  controllers: [AppController],
  providers: [AppService, SearchService, InitializationsService, GetProductServiceService],
})
export class AppModule { }
