import { User } from '../../modules/users/user.entity';
import { createConnections, getConnection, getRepository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { factory, useRefreshDatabase, useSeeding } from 'typeorm-seeding';

export const usersTestRepository = (): Provider<any> => ({
  provide: getRepositoryToken(User),
  useValue: getRepository(User),
});

export const generateTestUsers = async (n: number = 10): Promise<User[]> => {
  await useSeeding();
  return await factory(User)().createMany(n);
};
