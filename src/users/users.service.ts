import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('u');
    queryBuilder.orderBy('u.id', 'ASC');
    queryBuilder.select(['u.id', 'u.name', 'u.email']);
    return paginate<User>(queryBuilder, options);
  }

  async create(attributes: Partial<User>): Promise<User> {
    const entity = Object.assign(new User(), attributes);
    return await this.usersRepository.save(entity);
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id, {
      select: ['id', 'name', 'email'],
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
