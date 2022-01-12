require('dotenv').config();

const connectionDetails = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

module.exports = {
  ...connectionDetails,
  type: 'postgres',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: true,
};
