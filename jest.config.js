module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: '<rootDir>/src/testing/globalSetup.ts',
  globalTeardown: '<rootDir>/src/testing/globalTeardown.ts',
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/src/testing/jest.setup.ts'],
  resetModules: false,
  testPathIgnorePatterns: ['node_modules'],
  testRunner: 'jest-circus/runner',
};
