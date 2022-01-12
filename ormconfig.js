require('dotenv').config();

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'nestjs',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
  },
  {
    name: 'test',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.TEST_DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  },
];
