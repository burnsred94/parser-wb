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
import { ValidatorService } from './modules/validator/validator.service';
import { UpdateLogin } from './actions/action.login';
import { UpdateLogout } from './actions/logout';

const sessions = new LocalSession({
  database: './sessions.json'
})

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: '6054044696:AAFGvQUnf1ka-lSDRiM1CY0Y_Cy6VymwBA0',
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
    UpdateActionSupport,
    UpdateChats,
    UpdateReview,
    UpdateTrackerPosition,
    UpdateServices,
    TaskManagerService,
    ValidatorService,
    UpdateLogin,
    UpdateLogout
  ],
})
export class AppModule { }
