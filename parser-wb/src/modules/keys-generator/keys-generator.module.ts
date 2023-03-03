import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'src/modules/catalog/category.module';
import { SubCategoryModule } from 'src/modules/sub-category/sub-category.module';
import { KeysGeneratorService } from './keys-generator.service';
import { Keys, KeysSchema } from './schemas/key.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Keys.name, schema: KeysSchema }]),
        SubCategoryModule,
        CategoryModule
    ],
    providers: [KeysGeneratorService],
    exports: [KeysGeneratorService],
})
export class KeysGeneratorModule { }
