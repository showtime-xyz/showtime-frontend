const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest.application[0].activity[0].$[
      "android:exported"
    ] = "true";

    return config;
  });
};
