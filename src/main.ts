import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './shared/config/app.config';
import { setUpWinstonLogger } from './shared/utils/winston-logger.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  setUpWinstonLogger(app);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<IAppConfig>('app').port);
}
bootstrap();
