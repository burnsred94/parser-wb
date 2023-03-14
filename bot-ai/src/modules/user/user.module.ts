import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  exports: [UserService],
  providers: [UserService],
  imports: [DatabaseModule, MongooseModule.forFeature([{name: 'User', schema: UserSchema}])]
})
export class UserModule {}
