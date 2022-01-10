import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { User } from '../../users/user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.name = faker.name.firstName() + ' ' + faker.name.lastName();
  user.email = faker.internet.email();
  user.password = '1234pass';
  return user;
});
