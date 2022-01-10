import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['id', 'name', 'email'] });
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
