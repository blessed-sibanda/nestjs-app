module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nestjs',
  password: '1234pass',
  database: 'nestjs',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: 'true',
};
