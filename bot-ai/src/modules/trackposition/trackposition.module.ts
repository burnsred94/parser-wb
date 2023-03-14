import { Module } from '@nestjs/common';
import { TrackpositionService } from './trackposition.service';

@Module({
  providers: [TrackpositionService]
})
export class TrackpositionModule {}
