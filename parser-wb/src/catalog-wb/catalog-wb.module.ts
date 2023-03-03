import { Module } from '@nestjs/common';
import { CatalogWbService } from './catalog-wb.service';
import { CatalogWbController } from './catalog-wb.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CatalogWbService],
  controllers: [CatalogWbController],
})
export class CatalogWbModule {}
