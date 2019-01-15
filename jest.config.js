// jest.config.js
// const { defaults: tsjPreset } = require('ts-jest/presets');
// const { jsWithTs: tsjPreset } = require('ts-jest/presets');
// const { jsWithBabel: tsjPreset } = require('ts-jest/presets');
const tsjest = require('ts-jest')

/*
"jest": {
  "preset": "jest-preset-angular",
  "setupTestFrameworkScriptFile": "<rootDir>/src/setupJest.ts",
  "moduleNameMapper": {
    "c3": "<rootDir>/__mocks__/c3.js"
  }
}
*/

module.exports = {
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "<rootDir>/src/setupJest.ts",
  moduleNameMapper: {
    c3: "<rootDir>/__mocks__/c3.js"
  }
  /*,
  // [...]
  transform: {
    ...tsjPreset.transform,
    // [...]
  }*/
}