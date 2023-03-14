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

const sessions = new LocalSession({
  database: './sessions.json'
})

@Module({
  imports: [

    TelegrafModule.forRoot({
      token: '6054044696:AAFGvQUnf1ka-lSDRiM1CY0Y_Cy6VymwBA0',
      middlewares:[sessions]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TrackpositionModule,
    AuthModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UpdateRegister, InitializerService, UpdateAiCopyWrite, UpdateMenuCopyWrite, UpdateActionSupport, UpdateChats,UpdateReview, UpdateTrackerPosition, UpdateServices],
})
export class AppModule {}
