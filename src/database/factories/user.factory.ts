import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { User } from '../../modules/users/user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  user.name = firstName + ' ' + lastName;
  firstName = firstName.replace(/[^a-zA-Z0-9 -]/, '');
  lastName = lastName.replace(/[^a-zA-Z0-9 -]/, '');
  user.email = firstName + '.' + lastName + '@example.com';
  user.password = '1234pass';
  return user;
});
