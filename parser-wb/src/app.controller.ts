import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Article } from './modules/initializations/interfaces/initialization.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/search')
  getSearchKey(@Body() dto: Article) {

    return this.appService.search(dto)
  }

  @Post('/get-keys')
  getKeys(@Body() dto: Article) {
    console.log('1')
    return this.appService.getKeysInstance(dto)
  }
}
