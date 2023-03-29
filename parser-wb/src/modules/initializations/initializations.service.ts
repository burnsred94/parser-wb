import { Injectable } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { CategoryService } from '../catalog/catalog.service';
import { GetProductServiceService } from '../get-product-service/get-product-service.service';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { Article, IFcCheck, IProduct } from './interfaces/initialization.interface';

@Injectable()
export class InitializationsService {

    constructor(
        private readonly productService: GetProductServiceService,
        private readonly categoryService: CategoryService,
        private readonly subCategoryService: SubCategoryService,
        private readonly articleService: ArticleService
    ) { }

    async init(dto: Article) {
        const product = await this.productService.getProduct(dto.article);
        const checkEntity = await this.check(product, dto.article);

        if (checkEntity.findCategory.state && checkEntity.findSubCategory.state && checkEntity.findArticle.state) {

        } else {
            await this.generateEntities(checkEntity)
        }

        return product;
    }

    async check(product: IProduct, article: string): Promise<IFcCheck> {
        const findCategory = await this.categoryService.findByName(product.subj_root_name);
        const findSubCategory = await this.subCategoryService.findByName(product.subj_name);
        const findArticle = await this.articleService.findByArticle(article);

        return {
            findCategory: { state: findCategory, name: product.subj_root_name },
            findSubCategory: { state: findSubCategory, name: product.subj_name },
            findArticle: { state: findArticle, name: article }
        };
    }

    async generateEntities(result: IFcCheck): Promise<void> {

        if (result.findCategory.state === null) {
            await this.categoryService.create(result.findCategory.name);
        }

        if (result.findSubCategory.state === null) {
            const category = result.findCategory.state === null ?
                await this.categoryService.findByName(result.findCategory.name) :
                result.findCategory.state

            const subCategory = await this.subCategoryService.create({
                name: result.findSubCategory.name,
                category: category
            });

            await this.categoryService.updateSubCategory({ name: result.findCategory.name, sub_category: subCategory })
        }

        if (result.findArticle.state === null) {
            const category = result.findCategory.state === null ?
                await this.categoryService.findByName(result.findCategory.name) :
                result.findCategory.state

            const subCategory = result.findSubCategory.state === null ?
                await this.subCategoryService.findByName(result.findSubCategory.name) :
                result.findSubCategory.state

            await this.articleService.createArticle({
                article: result.findArticle.name,
                categories: category,
                sub_category: subCategory
            });

        }
    }
}
