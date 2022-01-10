import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { textSearchByFields } from 'typeorm-text-search';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(
    options: IPaginationOptions,
    q: string = '',
  ): Promise<Pagination<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('u');
    textSearchByFields<User>(queryBuilder, q, ['name', 'email']);
    queryBuilder.orderBy('u.id', 'ASC');
    queryBuilder.select([
      'u.id',
      'u.name',
      'u.email',
      'u.image',
      'u.createdAt',
      'u.updatedAt',
    ]);
    return paginate<User>(queryBuilder, options);
  }

  async create(attributes: Partial<User>): Promise<User> {
    const entity = Object.assign(new User(), attributes);
    return await this.usersRepository.save(entity);
  }

  async update(user: User, attributes: Partial<User>): Promise<User> {
    const entity = Object.assign(user, attributes);
    await this.usersRepository.save(entity);
    return this.findById(user.id);
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(id, {
      select: ['id', 'name', 'email', 'image', 'createdAt', 'createdAt'],
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
