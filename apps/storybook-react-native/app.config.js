export default {
  name: "Showtime",
  description: "Showtime Storybook",
  slug: "showtime-storybook-react-native",
  owner: "showtime-xyz",
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
  extra: {
    eas: {
      projectId: "e77d5b68-bb27-45da-aa5c-96c1fdbf6706",
    },
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
    // Detox adds network config xml in android. We don't need it during development. It can cause issues while connecting to metro server
    process.env.DETOX ? "@config-plugins/detox" : (x) => x,
    [
      "expo-image-picker",
      {
        photosPermission: "$(PRODUCT_NAME) needs access to your photos.",
      },
    ],
    [
      "./plugins/with-pick-first.js",
      {
        paths: [
          "lib/**/libreactnativejni.so",
          "lib/**/libreact_nativemodule_core.so",
          "lib/**/libfbjni.so",
          "lib/**/libturbomodulejsijni.so",
          "lib/**/libcrypto.so",
          "lib/**/libssl.so",
        ],
      },
    ],
    "./plugins/with-android-manifest.js",
    "./plugins/with-hermes-ios-m1-workaround.js",
    "./plugins/react-native-cronet.js",
    "./plugins/with-animated-webp-support.js",
    "./plugins/with-fast-image-webp-support-android.js",
    "./plugins/with-fast-image-webp-support-ios.js",
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 32,
          targetSdkVersion: 32,
          buildToolsVersion: "32.0.0",
          kotlinVersion: "1.6.10",
        },
        ios: {
          deploymentTarget: "13.0",
        },
      },
    ],
  ],
};
