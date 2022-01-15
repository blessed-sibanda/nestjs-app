require('dotenv').config();

const connectionDetails = {
  host: 'localhost',
  name: 'test',
  port: 5432,
  username: 'nestjs',
  password: '1234pass',
  database: 'nestjs-test',
};

module.exports = {
  ...connectionDetails,
  type: 'postgres',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: false,
};
