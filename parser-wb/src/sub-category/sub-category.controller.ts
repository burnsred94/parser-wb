import { Controller, Get, Param } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {

    constructor(private readonly subCategoriesService: SubCategoryService){}

    @Get(':id')
    async getCategoryById(@Param('id') id){
        return await this.subCategoriesService.findById(id);
    }
}
