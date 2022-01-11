import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  generateTestUsers,
  usersTestRepository,
} from '../../shared/utils/testing.utils';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { AppService } from '../../app.service';

describe('UsersService', () => {
  let service: UsersService;
  let appService: AppService;
  let usersRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, await usersTestRepository(), AppService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
    appService = module.get<AppService>(AppService);
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

  describe('create', () => {
    it('creates new user', async () => {
      let email = `blessed-${randomInt(1000)}@example.com`;
      let result = async () => await usersRepo.findOne({ email });
      expect(await result()).not.toBeDefined();

      await service.create({
        name: 'Blessed',
        email,
        password: '1234pass',
      });

      expect(await result()).toBeDefined();
    });
  });

  describe('update', () => {
    let user, updatedUser: User;

    beforeEach(async () => {
      user = (await generateTestUsers(1))[0];
    });

    it('updates user details', async () => {
      await service.update(user, { name: 'New Name' });
      updatedUser = await usersRepo.findOne({ id: user.id });
      expect(updatedUser.name).toEqual('New Name');
    });

    it('returns the updated user', async () => {
      let result = await service.update(user, { name: 'New Name' });
      updatedUser = await usersRepo.findOne({ id: user.id });
      expect(updatedUser).toEqual(result);
    });

    describe('image update', () => {
      it('updates user image', async () => {
        await service.update(user, {
          name: 'New Name',
          image: 'my-pic.jpg',
        });
        updatedUser = await usersRepo.findOne({ id: user.id });
        expect(updatedUser.image).toBe('my-pic.jpg');
      });

      it('deletes original image', async () => {
        let deleteFile = jest.spyOn(appService, 'deleteFile');
        user.image = 'img1.png';
        await usersRepo.save(user);
        await service.update(user, {
          name: 'New Name',
          image: 'my-pic2.jpg',
        });
        expect(deleteFile).toHaveBeenCalledWith('img1.png');
        updatedUser = await usersRepo.findOne({ id: user.id });
        expect(updatedUser.image).toBe('my-pic2.jpg');
      });
    });
  });

  describe('remove', () => {
    let user: User;

    beforeEach(async () => {
      user = (await generateTestUsers(1))[0];
      user.image = 'pic.jpg';
      await usersRepo.save(user);
    });

    it('deletes user and its image (if present)', async () => {
      let deleteFile = jest.spyOn(appService, 'deleteFile');
      let result = async () => await usersRepo.findOne({ email: user.email });
      expect(await result()).toBeDefined();
      await service.remove(user.id);
      expect(await result()).not.toBeDefined();
      expect(deleteFile).toHaveBeenCalledWith('pic.jpg');
    });
  });
});
