import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

let user = new User({
  name: 'Blessed',
  email: 'blessed@example.com',
  password: '1234pass',
});

describe('AuthService', () => {
  let service: AuthService;
  let jwtServ: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    })
      .overrideProvider(JwtService)
      .useValue({ sign: () => 'some-jwt-token' })
      .overrideProvider(UsersService)
      .useValue({
        findOneByEmail: (email) => (email == user.email ? user : null),
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    jwtServ = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('login', () => {
    it('should return access token', () => {
      expect(service.login(user)).toEqual({
        access_token: 'some-jwt-token',
      });
    });
  });

  describe('validateUser', () => {
    beforeAll(() => {
      jest
        .spyOn(user, 'isValidPassword')
        .mockImplementation(async (pwd) => pwd == user.password);
    });

    it('returns null if password/email is invalid', async () => {
      let result = await service.validateUser(
        'blessed@example.com',
        '1234pass',
      );
      expect(result).toBeNull;
    });

    it('returns null if password is invalid', async () => {
      let result = await service.validateUser('jon@example.com', '1234pass');
      expect(result).toBeNull;
    });

    it('returns the user if email & password are valid', async () => {
      let result = await service.validateUser(user.email, user.password);
      expect(result).not.toBeNull();
      expect(result.name).toBe(user.name);
      expect(result.email).toBe(user.email);
    });
  });
});
