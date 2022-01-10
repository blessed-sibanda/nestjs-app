import { Injectable } from '@nestjs/common';

export interface IUser {
  userId: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      userId: 1,
      username: 'Blessed',
      password: '1234pass',
    },
    {
      userId: 2,
      username: 'Thelma',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
