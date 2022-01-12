import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
}

export const appConfig = registerAs(
  'app',
  (): IAppConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
  }),
);
