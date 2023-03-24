import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TaskManagerService } from './task-manager.service';

@Module({
  imports: [UserModule],
  providers: [TaskManagerService],
  exports: [TaskManagerService,]
})
export class TaskManagerModule {}
