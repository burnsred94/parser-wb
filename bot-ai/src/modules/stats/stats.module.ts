import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsSchema } from './schemas/stats.schema';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { DateGenerator } from './utils/date.generator';
import { ExcelGenerator } from './utils/excel,generator';

@Module({
    imports:[MongooseModule.forFeature([{name: 'Stats', schema: StatsSchema}])],
    exports: [StatsService],
    providers: [StatsService, DateGenerator, ExcelGenerator],
    controllers: [StatsController]
})

export class StatsModule {}
