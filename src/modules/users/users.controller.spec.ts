import { Test, TestingModule } from '@nestjs/testing';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const ble = new User({
  name: 'Blessed',
  email: 'blessed@example.com',
  password: '1234pass',
});

const thelma = new User({
  name: 'Thelma',
  email: 'thelma@example.com',
  password: '1234pass',
});

const mike = new User({
  name: 'Mike',
  email: 'mike@example.com',
  password: '1234pass',
});

const userArray: User[] = [ble, thelma, mike];

const mockFindAll = (options: IPaginationOptions, q?: string) => {
  let limit = options.limit as number;
  let totalPages = Math.ceil(userArray.length / limit);
  let items: User[];
  if (q) {
    items = userArray.filter((i) => {
      q = q.toLowerCase();
      return (
        i.name.toLowerCase().startsWith(q) ||
        i.email.toLowerCase().startsWith(q)
      );
    });
  } else items = userArray;

  let resultItems = items.slice(0, limit);
  let currentPage = options.page as number;

  let result = {
    items: resultItems,
    meta: {
      totalItems: userArray.length,
      itemCount: resultItems.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: options.page,
    },
    links: {
      first: `${options.route}?limit=${limit}`,
      previous:
        options.page > 1
          ? `${options.route}?page=${currentPage - 1}&limit=${limit}`
          : '',
      next:
        currentPage < totalPages
          ? `${options.route}?page=${currentPage + 1}&limit=${limit}`
          : '',
      last: `${options.route}?page=${currentPage}&limit=${limit}`,
    },
  };

  return result;
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue({
        findAll: mockFindAll,
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return paginated user list', () => {
      let result = controller.index(1, 10, '');
      expect(result['items']).toEqual(userArray);
    });
  });
});
