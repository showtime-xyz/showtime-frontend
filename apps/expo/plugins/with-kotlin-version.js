const { withProjectBuildGradle } = require("@expo/config-plugins");

const setKotlinVersion = (buildGradle, kotlinVersion) => {
  const regexpKotlinVersion = /\bkotlinVersion\s*=\s*("1.4.21")/;
  const match = buildGradle.match(regexpKotlinVersion);

  if (match) {
    buildGradle = buildGradle.replace(
      /\bkotlinVersion\s*=\s*("1.4.21")/,
      `kotlinVersion = ${kotlinVersion}`
    );
  }

  return buildGradle;
};

module.exports = (config, kotlinVersion) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setKotlinVersion(
        config.modResults.contents,
        kotlinVersion
      );
    } else {
      throw new Error(
        "Can't set kotlinVersion in the project build.gradle, because it's not groovy"
      );
    }
    return config;
  });
};
