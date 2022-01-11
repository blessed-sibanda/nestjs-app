import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  generateTestUsers,
  usersTestRepository,
} from '../../shared/utils/testing.utils';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, await usersTestRepository()],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all users', async () => {
      await generateTestUsers(2);
      let result = await service.findAll({ page: 1, limit: 10 });
      expect(result['items'].length).toBe(2);
    });
  });
});
