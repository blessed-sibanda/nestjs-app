import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authServ: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue({ login: () => null })
      .compile();

    authServ = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {});
});
