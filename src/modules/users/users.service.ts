import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AppService } from '../../app.service';
import { Repository } from 'typeorm';
import { textSearchByFields } from 'typeorm-text-search';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private appService: AppService,
  ) {}

  findAll(
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
    const entity = new User(attributes);
    return await this.usersRepository.save(entity);
  }

  async update(user: User, attributes: Partial<User>): Promise<User> {
    const entity = Object.assign(user, attributes);
    let u = await this.usersRepository.findOne(user.id);
    if (attributes.image) await this.appService.deleteFile(u.image);

    return await this.usersRepository.save(entity);
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(id, {
      select: ['id', 'name', 'email', 'image', 'createdAt', 'createdAt'],
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async remove(id: number): Promise<void> {
    let user = await this.findById(id);
    await this.usersRepository.delete(id);
    await this.appService.deleteFile(user.image);
  }
}
