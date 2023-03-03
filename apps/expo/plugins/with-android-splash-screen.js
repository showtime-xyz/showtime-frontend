const {
  createRunOncePlugin,
  AndroidConfig,
  withStringsXml,
} = require("@expo/config-plugins");

// This plugin fixes the initial statusbar shifting when the android app is booting up.
const withAndroidSplashScreen = (expoConfig) =>
  withStringsXml(expoConfig, (modConfig) => {
    modConfig.modResults = AndroidConfig.Strings.setStringItem(
      [
        {
          _: "true",
          $: {
            name: "expo_splash_screen_status_bar_translucent",
            translatable: "false",
          },
        },
      ],
      modConfig.modResults
    );
    return modConfig;
  });

module.exports = createRunOncePlugin(
  withAndroidSplashScreen,
  "android-splash",
  "1.0.0"
);
