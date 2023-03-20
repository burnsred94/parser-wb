import { Controller, Get, Header, Res } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Response } from 'express';

@Controller('stats')
export class StatsController {

    constructor(private readonly statsService: StatsService) {}

    @Get('mouth')
    @Header('Content-Type', 'text/xlsx')
    async getMout(@Res() res: Response) {
        const xlsx = await this.statsService.getMouth();
        res.download(`${xlsx}`)
    }
}
