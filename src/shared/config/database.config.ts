import { registerAs } from '@nestjs/config';

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  database: string;
  password: string;
}

export const databaseConfig = registerAs(
  'database',
  (): IDatabaseConfig => ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  }),
);
