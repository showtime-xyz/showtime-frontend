const { withAppBuildGradle } = require("@expo/config-plugins");

function withCustomAppBuildGradle(config) {
  const insertString = `  manifestPlaceholders = [redirectSchemeName: "io.showtime", redirectHostName: "spotify-success" ]`;

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes(insertString)) {
      return config;
    }
    config.modResults.contents = config.modResults.contents.replace(
      `defaultConfig {`,
      `defaultConfig {
      ${insertString}`
    );

    return config;
  });
}

module.exports = function withSpotifySDK(config) {
  config = withCustomAppBuildGradle(config);
  return config;
};
