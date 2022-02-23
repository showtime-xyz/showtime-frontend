import "dotenv/config";
import semver from "semver";

import packageJSON from "../../package.json";

const STAGE = process.env.STAGE;
const SCHEME = process.env.SCHEME ?? "io.showtime";

const envConfig = {
  development: {
    scheme: `${SCHEME}.development`,
    icon: "./assets/icon.development.png",
    foregroundImage: "./assets/adaptive-icon.png",
    backgroundImage: "./assets/adaptive-icon-background.development.png",
  },
  staging: {
    scheme: `${SCHEME}.staging`,
    icon: "./assets/icon.staging.png",
    foregroundImage: "./assets/adaptive-icon.png",
    backgroundImage: "./assets/adaptive-icon-background.staging.png",
  },
  production: {
    scheme: SCHEME,
    icon: "./assets/icon.png",
    foregroundImage: "./assets/adaptive-icon.png",
    backgroundImage: "./assets/adaptive-icon-background.png",
  },
};

const config = envConfig[STAGE ?? "development"];
const version = packageJSON.version;
const majorVersion = semver.major(version);

export default {
  name: "Showtime",
  description: "The web3 social network",
  slug: "showtime",
  scheme: config.scheme,
  owner: "tryshowtime",
  icon: config.icon,
  version: version.toString(),
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  ios: {
    bundleIdentifier: config.scheme,
    buildNumber: majorVersion.toString(),
    supportsTablet: true,
    jsEngine: "hermes",
    backgroundColor: "#FFFFFF",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: config.scheme,
    versionCode: majorVersion,
    adaptiveIcon: {
      foregroundImage: config.foregroundImage,
      backgroundImage: config.backgroundImage,
    },
    jsEngine: "hermes",
    softwareKeyboardLayoutMode: "pan",
  },
  androidNavigationBar: {
    barStyle: "dark-content",
    backgroundColor: "#FFFFFF",
  },
  assetBundlePatterns: ["**/*"],
  orientation: "portrait",
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/45cbf5d5-24fe-4aa6-9580-acf540651abd",
  },
  // We use the major version for the runtime version so it's in sync
  // with the native app version and should prevent us from sending an update
  // without the correct native build.
  // Learn more: https://docs.expo.dev/eas-update/runtime-versions
  runtimeVersion: majorVersion.toString(),
  extra: {
    STAGE: process.env.STAGE,
    eas: {
      projectId: "45cbf5d5-24fe-4aa6-9580-acf540651abd",
    },
  },
  plugins: [
    // detox adds network config xml in android. We don't need it during development. It can cause issues while connecting to metro server
    process.env.DETOX ? "@config-plugins/detox" : (x) => x,
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
    "@logrocket/react-native",
    "./plugins/with-hermes-ios-m1-workaround.js",
    "sentry-expo",
  ],
};
