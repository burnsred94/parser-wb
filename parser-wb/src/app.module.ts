import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchService } from './search/search.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { KeysGeneratorModule } from './keys-generator/keys-generator.module';
import { SearchModule } from './search/search.module';
import { CategoryModule } from './catalog/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './parser-wb/.env'
  }),
  DatabaseModule,
  KeysGeneratorModule,
  SearchModule,
  CategoryModule,
  SubCategoryModule
],
  controllers: [AppController],
  providers: [AppService, SearchService],
})
export class AppModule {}
