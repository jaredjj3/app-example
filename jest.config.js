module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/src/testing/jest.setup.ts'],
  resetModules: false,
  testPathIgnorePatterns: ['node_modules'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
