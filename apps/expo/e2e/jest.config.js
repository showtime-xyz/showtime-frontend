module.exports = {
  testEnvironment: require.resolve("./environment.js"),
  testRunner: require.resolve("jest-circus/runner"),
  testTimeout: 120000,
  testRegex: "/__tests__/.*(e2e)\\.[jt]sx?$",
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  reporters: [require.resolve("detox/runners/jest/streamlineReporter")],
  verbose: true,
};
