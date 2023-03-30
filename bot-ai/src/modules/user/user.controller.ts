import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './interfaces/user.interfaces';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post('create')
    async create(@Body() dto: UserDto): Promise<IUser> {
        return this.userService.create(dto);
    }
}
