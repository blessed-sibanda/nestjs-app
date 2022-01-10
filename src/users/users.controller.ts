import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
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
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<User>> {
    limit = limit > 50 ? 50 : limit;
    return this.usersService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/users',
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
