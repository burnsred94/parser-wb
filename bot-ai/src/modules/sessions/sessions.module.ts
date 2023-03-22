import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schemas/sessions.schema';
import { SessionsService } from './sessions.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
    providers: [SessionsService],
    exports: [SessionsService]
})
export class SessionsModule {}
