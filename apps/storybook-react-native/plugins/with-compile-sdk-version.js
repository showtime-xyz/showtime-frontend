const { withProjectBuildGradle } = require("@expo/config-plugins");

const setCompileSdkVersion = (buildGradle, sdkVersion) => {
  const regexpCompileSdkVersion = /\bcompileSdkVersion\s*=\s*(\d+)/;
  const match = buildGradle.match(regexpCompileSdkVersion);

  if (match) {
    const existingVersion = parseInt(match[1], 10);

    if (existingVersion < sdkVersion) {
      buildGradle = buildGradle.replace(
        /\bcompileSdkVersion\s*=\s*\d+/,
        `compileSdkVersion = ${sdkVersion}`
      );
    } else {
      console.log(`compileSdkVersion is already >= ${sdkVersion}`);
    }
  }

  return buildGradle;
};

const setTargetSdkVersion = (buildGradle, sdkVersion) => {
  const regexpTargetSdkVersion = /\btargetSdkVersion\s*=\s*(\d+)/;
  const match = buildGradle.match(regexpTargetSdkVersion);

  if (match) {
    const existingVersion = parseInt(match[1], 10);

    if (existingVersion < sdkVersion) {
      buildGradle = buildGradle.replace(
        /\btargetSdkVersion\s*=\s*\d+/,
        `targetSdkVersion = ${sdkVersion}`
      );
    } else {
      console.log(`targetSdkVersion is already >= ${sdkVersion}`);
    }
  }

  return buildGradle;
};

module.exports = (config, sdkVersion) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setCompileSdkVersion(
        config.modResults.contents,
        sdkVersion
      );
      config.modResults.contents = setTargetSdkVersion(
        config.modResults.contents,
        sdkVersion
      );
    } else {
      throw new Error(
        "Can't set compileSdkVersion and targetSdkVersion in the project build.gradle, because it's not groovy"
      );
    }
    return config;
  });
};
