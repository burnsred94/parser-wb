import { Injectable } from '@nestjs/common';
import { Update } from 'nestjs-telegraf';

@Injectable()
export class TrackpositionService {

    
    async getTrackposition(articleId: string) {
        return 'Hello World'
    }
}
