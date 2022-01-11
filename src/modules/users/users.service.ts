import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { textSearchByFields } from 'typeorm-text-search';
import { User } from './user.entity';
import { deleteFile } from 'src/shared/utils/file-upload.utils';

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

  async update(
    user: User,
    attributes: Partial<User>,
    image?: string,
  ): Promise<User> {
    const entity = Object.assign(user, attributes);
    let u = await this.findById(user.id);
    if (image) {
      await deleteFile(u.image);
      entity.image = image;
    }
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

  async remove(id: number): Promise<void> {
    let user = await this.findById(id);
    await this.usersRepository.delete(id);
    await deleteFile(user.image);
  }
}
