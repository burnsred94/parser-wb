import { Body, Controller, Get, Header, Post, Res } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Response } from 'express';
import { StatsDto } from './dto/stats.dto';

@Controller('stats')
export class StatsController {

    constructor(private readonly statsService: StatsService) {}

    @Get('mouth')
    @Header('Content-Type', 'text/xlsx')
    async getMout(@Res() res: Response) {
        const xlsx = await this.statsService.getMouth();
        res.download(`${xlsx}`)
    }

    @Post('pull')
    async pullStatsData(@Body() dto: StatsDto) {
        return await this.statsService.pullStatsData(dto);
    }
}
