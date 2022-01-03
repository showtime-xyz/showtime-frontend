export default {
  name: "Showtime",
  description: "Showtime Storybook",
  slug: "showtime-storybook-react-native",
  owner: "tryshowtime",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.storybook.png",
  scheme: "io.showtime.storybook",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "io.showtime.storybook",
    buildNumber: "1.0.0",
    supportsTablet: true,
    jsEngine: "hermes",
    backgroundColor: "#FFFFFF",
  },
  android: {
    package: "io.showtime.storybook",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundImage: "./assets/adaptive-icon-background.storybook.png",
    },
    jsEngine: "hermes",
  },
  androidNavigationBar: {
    barStyle: "dark-content",
    backgroundColor: "#FFFFFF",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
};
