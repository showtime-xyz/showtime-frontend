const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest.application[0].activity[0].$[
      "android:exported"
    ] = "true";

    if (
      config.extra.STAGE === "development" ||
      config.extra.STAGE === undefined
    ) {
      config.modResults.manifest.application[0].activity[0].$[
        "android:usesCleartextTraffic"
      ] = "true";
    }

    return config;
  });
};
