import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratorDataService } from './generator-data.service';
import { GeneratorData, GeneratorDataSchema } from './schemas/schema.chank';

@Module({
    exports: [GeneratorDataService],
    imports: [MongooseModule.forFeature([{ name: GeneratorData.name, schema: GeneratorDataSchema }])],
    providers: [GeneratorDataService],

})
export class GeneratorDataModule { }
