import { User } from '../../modules/users/user.entity';
import { Connection, getRepository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Factory,
  factory,
  runSeeder,
  Seeder,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';

export const usersTestRepository = async (): Promise<Provider<any>> => {
  await useRefreshDatabase({
    configName: 'test-ormconfig.js',
  });

  return {
    provide: getRepositoryToken(User),
    useValue: getRepository(User, 'testing'),
  };
};

export const generateTestUsers = async (n: number = 10) => {
  await useSeeding();
  await factory(User)().createMany(n);
};