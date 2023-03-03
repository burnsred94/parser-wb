import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/search')
  getSearchKey(@Body() dto: string) {

    return this.appService.search(dto)

  }
}
