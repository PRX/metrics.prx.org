module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  moduleNameMapper: {
    c3: '<rootDir>/__mocks__/c3.js',
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@testing/(.*)': '<rootDir>/src/testing/$1'
  },
  coverageDirectory: './coverage/'
};
