import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
  Delete,
} from '@nestjs/common';
import {
  InjectLogger,
  NestjsWinstonLoggerService,
} from 'nestjs-winston-logger';
import { JoiValidationPipe } from 'src/shared/joi-validation.pipe';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectLogger(UsersController.name)
    private logger: NestjsWinstonLoggerService,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(User.schema))
  create(@Body() user: Partial<User>) {
    this.logger.log(`user --> ${JSON.stringify(user)}`);
    return this.usersService.create(user);
  }

  @Get()
  findAll() {
    this.logger.log('getting all users');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
