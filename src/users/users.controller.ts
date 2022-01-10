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
  Request,
  ForbiddenException,
  UseGuards,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  InjectLogger,
  NestjsWinstonLoggerService,
} from 'nestjs-winston-logger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JoiValidationPipe } from 'src/shared/joi-validation.pipe';
import { imageUploadMulterOptions } from 'src/shared/file-upload.utils';
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
  @UsePipes(new JoiValidationPipe(User.createSchema))
  create(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadMulterOptions))
  async update(
    @Body(new JoiValidationPipe(User.updateSchema)) data: Partial<User>,
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (req.user.id != id)
      throw new ForbiddenException('You can only update your profile');
    else {
      let user = await this.usersService.update(
        req.user,
        data,
        image?.filename,
      );
      return user;
    }
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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    let user = await this.usersService.findById(id);
    if (user) return user;
    else throw new NotFoundException('User not found');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.id === id) return this.usersService.remove(id);
    else throw new ForbiddenException('You can only delete your profile');
  }
}
