module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    "<rootDir>/tests/fixtures",
    "<rootDir>/tests/utils",
    "<rootDir>/tests/global-setup.js",
  ],
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  clearMocks: true,
};
