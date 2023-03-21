import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackpositionModule } from './modules/trackposition/trackposition.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { UpdateRegister } from './actions/action-register';
import { InitializerService } from './modules/initializer/initializer.service';
import * as LocalSession from 'telegraf-session-local';
import { UpdateAiCopyWrite } from './actions/action-soft';
import { UpdateMenuCopyWrite } from './actions/aciton-menu';
import { UpdateActionSupport } from './actions/action-support';
import { UpdateChats } from './actions/action-chats-and-chanels';
import { UpdateReview } from './actions/action-review';
import { UpdateTrackerPosition } from './actions/action-trakerposition';
import { UpdateServices } from './actions/action-services';
import { TaskManagerModule } from './modules/task-manager/task-manager.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskManagerService } from './modules/task-manager/task-manager.service';
import { StatsModule } from './modules/stats/stats.module';
import { SessionsModule } from './modules/sessions/sessions.module';

const sessions = new LocalSession({
  database: './sessions.json'
})

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: '6230430443:AAGoS3eiv1PEIpoJBHZskL6A5y0ZU375Abs',
      middlewares: [sessions]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TrackpositionModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    TaskManagerModule,
    StatsModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UpdateRegister,
    InitializerService,
    UpdateAiCopyWrite,
    UpdateMenuCopyWrite,
    UpdateActionSupport,
    UpdateChats,
    UpdateReview,
    UpdateTrackerPosition,
    UpdateServices,
    TaskManagerService,
  ],
})
export class AppModule { }
