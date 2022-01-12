import { Test, TestingModule } from '@nestjs/testing';
import {
  NestjsWinstonLoggerModule,
  NestjsWinstonLoggerService,
} from 'nestjs-winston-logger';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsWinstonLoggerModule.forRoot({})],
      controllers: [UsersController],
      providers: [UsersService, NestjsWinstonLoggerService],
    })
      .overrideProvider(UsersService)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
