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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body(new JoiValidationPipe(User.schema)) body: Partial<User>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(file);
    return {
      body,
      file: file?.buffer.toString(),
    };
  }

  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('q', new DefaultValuePipe('')) query: string,
  ): Promise<Pagination<User>> {
    limit = limit > 50 ? 50 : limit;
    return this.usersService.findAll(
      {
        page,
        limit,
        route: 'http://localhost:3000/users',
      },
      query,
    );
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
