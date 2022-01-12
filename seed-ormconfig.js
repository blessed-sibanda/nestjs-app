const baseConfig = require('./ormconfig');

module.exports = {
  ...baseConfig[0],
  entities: ['src/**/*.entity.ts'],
};
