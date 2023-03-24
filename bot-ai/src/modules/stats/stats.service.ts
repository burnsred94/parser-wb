import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDto } from './dto/stats.dto';
import { IStats } from './schemas/interfaces/stats.interfaces';
import { Stats, StatsDocument } from './schemas/stats.schema';
import { DateGenerator } from './utils/date.generator';
import { ExcelGenerator } from './utils/excel,generator';

@Injectable()
export class StatsService {
    date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

    constructor(
        @InjectModel(Stats.name) private _statsRepository: Model<StatsDocument>,
        private readonly dateGenerator: DateGenerator,
        private readonly excelGenerator: ExcelGenerator,
    ) { }

    async stats(data?: IStats) {
        const stats = await this.getStats();

        if (stats !== null) {
            await this.updateStats(data);
        } else {
            await this._statsRepository.create(new Stats());
            await this.updateStats(data);
        }
    }

    async getStats() {

        const stats = await this._statsRepository.findOne({
            date: this.date
        });

        return stats;
    }

    async updateStats(data: IStats) {

        if (data.reviews_or_copyright) {
            await this._statsRepository.updateOne(
                {
                    date: this.date,
                },
                {
                    $push: data
                }
            )
        } else {
            console.log(data);
            await this._statsRepository.updateOne({
                date: this.date
            },
                {
                    $inc: data
                }
            );

        }


    }

    async getMouth() {
        const allData = await this._statsRepository.find()


        const data = await this._statsRepository.find({
            date: {
                $in: await this.dateGenerator.generateDateMouth()
            }
        });

        return await this.excelGenerator.excelGenerate(allData.sort((a, b) => a.date > b.date? 1 : -1));

    }


    async pullStatsData(data: StatsDto | StatsDto[]) {

        if (data === data as StatsDto[] && data.length > 0) {
            const arrStats = []
             data.forEach(async (item) => {
                const data = await this._statsRepository.create(item)
                arrStats.push(data)
            });
            
            if(data.length === arrStats.length){
                return arrStats;
            }
        }

        if (data === data as StatsDto) {
            return await this._statsRepository.create(data);
        }
    }
}
