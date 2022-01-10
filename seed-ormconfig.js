const baseConfig = require('./ormconfig');

module.exports = {
  ...baseConfig,
  entities: ['src/**/*.entity.ts'],
};
