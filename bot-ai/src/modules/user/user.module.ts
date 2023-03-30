import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  exports: [UserService],
  providers: [UserService],
  imports: [DatabaseModule, MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  controllers: [UserController]
})
export class UserModule {}
