import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
  env: string;
}

export const appConfig = registerAs(
  'app',
  (): IAppConfig => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
  }),
);
