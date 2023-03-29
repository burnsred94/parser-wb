import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { CategoryModule } from '../catalog/category.module';
import { GetProductServiceModule } from '../get-product-service/get-product-service.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';

@Module({
    exports: [InitializationsModule],
    imports: [
        GetProductServiceModule,
        CategoryModule,
        SubCategoryModule,
        ArticleModule
    ]
})
export class InitializationsModule { }
