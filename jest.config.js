module.exports = {
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "<rootDir>/src/setupJest.ts",
  moduleNameMapper: {
    c3: "<rootDir>/__mocks__/c3.js"
  },
  testEnvironment: "jest-environment-jsdom-thirteen"
}