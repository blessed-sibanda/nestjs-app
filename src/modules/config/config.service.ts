import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService {
  dbConfig(): TypeOrmModuleOptions {
    console.log('this is the env -->', process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
      case 'production':
        return {
          type: 'postgres',
          host: '*',
          port: 5432,
          username: '*',
          password: '*',
          database: '*',
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
        };

      case 'testing':
        return {
          type: 'better-sqlite3',
          database: ':memory:',
          name: 'default',
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
        };

      default:
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'nestjs',
          password: '1234pass',
          database: 'nestjs',
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
        };
    }
  }
}
