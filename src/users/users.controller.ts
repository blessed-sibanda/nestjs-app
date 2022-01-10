import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/shared/joi-validation.pipe';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(User.schema))
  create(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
