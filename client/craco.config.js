const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^axios$': 'axios/dist/node/axios.cjs',
        '^.+\\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(axios|date-fns)/)'
      ],
    },
  },
};
