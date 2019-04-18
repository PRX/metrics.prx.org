module.exports = {
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "<rootDir>/src/setupJest.ts",
  moduleNameMapper: {
    c3: "<rootDir>/__mocks__/c3.js",
    "@app/(.*)": "<rootDir>/src/app/$1",
    "@testing/(.*)": "<rootDir>/src/testing/$1"
  },
  testEnvironment: "jest-environment-jsdom-thirteen",
  coverageDirectory: "./coverage/"
}
