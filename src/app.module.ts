import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { appConfig } from './shared/config/app.config';

import {
  databaseConfig,
  IDatabaseConfig,
} from './shared/config/database.config';
import { envSchemaConfig } from './shared/config/env-schema.config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV == 'test' ? '.test.env' : '.env',
      load: [databaseConfig, appConfig],
      validationSchema: envSchemaConfig,
      validationOptions: {
        abortEarly: true,
      },
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        name: 'test',
        database: configService.get<IDatabaseConfig>('database').database,
        username: configService.get<IDatabaseConfig>('database').username,
        host: configService.get<IDatabaseConfig>('database').host,
        port: configService.get<IDatabaseConfig>('database').port,
        password: configService.get<IDatabaseConfig>('database').password,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    MulterModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
