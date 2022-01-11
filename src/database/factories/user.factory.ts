import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { User } from '../../modules/users/user.entity';

define(User, (faker: typeof Faker) => {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let name = firstName + ' ' + lastName;

  firstName = firstName.replace(/[^a-zA-Z0-9 -]/, '');
  lastName = lastName.replace(/[^a-zA-Z0-9 -]/, '');
  let email = firstName + '.' + lastName + '@example.com';

  return new User({ name, email, password: '1234pass' });
});
