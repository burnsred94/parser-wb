import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoconfig } from './mongo.config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory:  (configService: ConfigService) => getMongoconfig(configService)
          })
    ]
})
export class DatabaseModule {}
