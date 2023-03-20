import { Module } from '@nestjs/common';
import { TaskManagerService } from './task-manager.service';

@Module({
  providers: [TaskManagerService],
  exports: [TaskManagerService]
})
export class TaskManagerModule {}
