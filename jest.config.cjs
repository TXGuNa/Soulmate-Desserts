module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
  moduleNameMapper: {
    '^\\/src\\/firebase$': '<rootDir>/__mocks__/src/firebase.js',
    '^../firebase$': '<rootDir>/__mocks__/src/firebase.js', // Added to handle relative imports
  },
};
