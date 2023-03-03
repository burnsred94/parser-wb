import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { CatalogWbService } from './catalog-wb.service';
import { CatalogDto } from './dto/catalog.dto';

@Controller('catalog-wb')
export class CatalogWbController {

  constructor(private readonly catalogService: CatalogWbService) {}

  @Post()
  async getData(@Body() dto: CatalogDto){
    return await this.catalogService.getDataCatalog(dto);
  }

  @Post('/search')
  async serche(@Body() dto) {
    return await this.catalogService.search(dto);
  }
}
