import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Module({
    imports: [UserModule],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
