import { User } from '../../users/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateUsers implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(User)().createMany(25);
  }
}
