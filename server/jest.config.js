const project = (displayName, testMatch) => ({
  displayName,
  testMatch,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        diagnostics: true,
      },
    ],
  },
});

module.exports = {
  rootDir: '..',
  projects: [
    project('unit', ['<rootDir>/tests/unit/**/*.test.ts']),
    project('integration', ['<rootDir>/tests/integration/**/*.test.ts']),
    project('system', ['<rootDir>/tests/system/**/*.test.ts']),
    project('nfr', ['<rootDir>/tests/nfr/**/*.test.ts']),
  ],
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/domain/**/*.ts',
    'src/controllers/**/*.ts',
    'src/routes/**/*.ts',
    'src/middlewares/**/*.ts',
  ],
  coverageDirectory: '../../reports/raw/coverage',
  coverageReporters: ['json-summary', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
    },
  },
};
