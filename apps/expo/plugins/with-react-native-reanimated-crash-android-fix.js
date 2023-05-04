const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withReactNativeReanimatedCrashAndroidFix(config) {
  return withAppBuildGradle(config, (config) => {
    const configString = `
    project.ext.reanimated = [
        buildFromSource: true
    ];
    `;

    config.modResults.contents += configString;
    return config;
  });
};
