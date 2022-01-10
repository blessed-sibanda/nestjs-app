import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestjsWinstonLoggerService,
  LoggingInterceptor,
  morganRequestLogger,
} from 'nestjs-winston-logger';
import { format, transports } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const globalLogger = new NestjsWinstonLoggerService({
    format: format.combine(
      format.timestamp({ format: 'isoDateTime' }),
      format.json(),
      format.colorize({ all: true }),
    ),
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' }),
      new transports.Console(),
    ],
  });
  app.useLogger(globalLogger);
  app.use(morganRequestLogger(globalLogger));

  await app.listen(3000);
}
bootstrap();
