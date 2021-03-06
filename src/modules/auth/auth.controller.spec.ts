import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let req = { user: new User({ email: 'test@example.com' }) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue({ login: () => null })
      .compile();

    authService = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login', () => {
      let login = jest.spyOn(authService, 'login');
      controller.login(req);
      expect(login).toBeCalledWith(req.user);
    });
  });

  describe('getProfile', () => {
    it('should return logged in user data', () => {
      let result = controller.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });
});
