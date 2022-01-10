import { Injectable } from '@nestjs/common';

export interface IUser {
  id: number;
  name: string;
  password: string;
  email: string;
}

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      id: 1,
      name: 'Blessed Sibanda',
      password: '1234pass',
      email: 'blessed@example.com',
    },
    {
      id: 2,
      name: 'Thelma Toro Sibanda',
      password: 'guess',
      email: 'thelma@example.com',
    },
  ];

  async findOne(email: string): Promise<IUser | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
