import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './catalog.service';
import { Category, CategorySchema } from './schemas/category.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
