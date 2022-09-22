// https://jestjs.io/docs/configuration
module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  // setupFilesAfterEnv: ['<rootDir>/scripts/setup-jest-env.ts'],
  rootDir: __dirname,
  globals: {
    __DEV__: true,
    __TEST__: true,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    __VERSION__: require('./package.json').version,
    __GLOBAL__: false,
    __ESM__: true,
    __NODE_JS__: true,
    'ts-jest': {
      tsconfig: {
        // https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
        target: 'es2019',
        sourceMap: true,
      },
    },
  },
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['packages/parser/src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/', '/lib/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@swet}/(.*?)$': '<rootDir>/packages/$1/src',
  },
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/examples/__tests__'],
}
