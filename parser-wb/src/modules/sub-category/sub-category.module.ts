import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategoryService } from './sub-category.service';
import { SubCategory, SubCategorySchema } from './schemas/sub-category.schemas';
import { SubCategoryController } from './sub-category.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }])],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
  controllers: [SubCategoryController]
})
export class SubCategoryModule {}
