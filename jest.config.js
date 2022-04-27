const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");

module.exports = {
  ...jestConfig,
  collectCoverageFrom: [
    "force-app/main/default/lwc/**/*.js",
    "!**/node_modules/**"
  ],
  moduleNameMapper: {
    "^c/(.*)": "<rootDir>/force-app/main/default/lwc/$1/$1.js"
  },
  modulePathIgnorePatterns: ["<rootDir>/.localdevserver"]
};
