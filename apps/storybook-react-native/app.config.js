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
    url: "https://u.expo.dev/e77d5b68-bb27-45da-aa5c-96c1fdbf6706",
  },
  runtimeVersion: {
    policy: "sdkVersion", // https://docs.expo.dev/eas-update/runtime-versions/
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
  plugins: [
    "@config-plugins/detox",
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "$(PRODUCT_NAME) needs access to your camera.",
        enableMicrophonePermission: true,
        microphonePermissionText:
          "$(PRODUCT_NAME) needs access to your microphone.",
        disableFrameProcessors: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "$(PRODUCT_NAME) needs access to your photos.",
      },
    ],
    ["./plugins/with-compile-sdk-version.js", 31],
    "./plugins/react-native-mmkv-plugin.js",
    [
      "./plugins/with-pick-first.js",
      {
        paths: ["lib/**/libreactnativejni.so"],
      },
    ],
    "expo-community-flipper",
    "./plugins/with-android-manifest.js",
    "./plugins/with-hermes-ios-m1-workaround.js",
  ],
};
