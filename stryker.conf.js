/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
const { jestConfig } = require("./jest.config.js");
module.exports = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information",
  packageManager: "npm",
  testRunner: "jest",
  mutator: "javascript",
  coverageAnalysis: "off",
  timeoutMS: 120000,
  tempDirName: "stryker-tmp",
  files: [
    "*",
    "force-app/main/default/lwc/*",
    "force-app/main/default/lwc/**/*"
  ],
  mutate: [
    "force-app/main/default/lwc/**/*.js",
    "!force-app/main/default/lwc/**/__tests__/*.*"
  ],
  reporters: ["html", "clear-text", "dots", "progress"],
  thresholds: { high: 90, low: 85, break: 90 },
  jest: {
    projectType: "custom",
    config: jestConfig,
    enableFindRelatedTests: true
  }
};
