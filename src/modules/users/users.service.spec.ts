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
    beforeAll(async () => await generateTestUsers(25));

    it('returns paginated user list sorted in ascending order', async () => {
      let result = await service.findAll({ page: 1, limit: 10 });
      expect(result['items'].length).toBe(10);
      expect(result['meta']).toEqual({
        totalItems: 25,
        itemCount: 10,
        itemsPerPage: 10,
        totalPages: 3,
        currentPage: 1,
      });
      expect(
        result['items'][0].id < result['items'][1].id &&
          result['items'][1].id < result['items'][2].id,
      ).toBeTruthy();
    });

    it('filters users using given query', async () => {
      let result = await service.findAll({ page: 1, limit: 10 }, 'b');
      result['items'].forEach((item) => {
        expect(item.name.toLowerCase() || item.email.toLowerCase()).toContain(
          'b',
        );
      });
    });
  });
});
