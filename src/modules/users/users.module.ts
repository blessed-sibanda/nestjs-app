import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NestjsWinstonLoggerModule } from 'nestjs-winston-logger';
import { AppService } from '../../app.service';
import { winstonConfig } from 'src/shared/utils/winston-logger.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NestjsWinstonLoggerModule.forRoot(winstonConfig),
  ],
  providers: [UsersService, AppService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
