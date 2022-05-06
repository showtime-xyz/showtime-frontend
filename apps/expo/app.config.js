const path = require("path");
const STAGE = process.env.STAGE ?? "production";
const envPath = path.resolve(__dirname, `.env.${STAGE}`);
const { withInfoPlist } = require("@expo/config-plugins");

require("dotenv").config({
  path: envPath,
});

const packageJSON = require("../../package.json");

const semver = require("semver");

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

const config = envConfig[STAGE];
const version = packageJSON.version;
const majorVersion = semver.major(version);

export default {
  name: "Showtime",
  description: "The web3 social network",
  slug: "showtime",
  scheme: config.scheme,
  owner: "showtime-xyz",
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
    bitcode: false, // or "Debug"
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
    STAGE: STAGE,
    eas: {
      projectId: "45cbf5d5-24fe-4aa6-9580-acf540651abd",
    },
  },
  plugins: [
    // Detox adds network config xml in android. We don't need it during development. It can cause issues while connecting to metro server
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
    [
      "./plugins/with-pick-first.js",
      {
        paths: [
          "lib/**/libreactnativejni.so",
          "lib/**/libreact_nativemodule_core.so",
          "lib/**/libfbjni.so",
          "lib/**/libturbomodulejsijni.so",
        ],
      },
    ],
    "expo-community-flipper",
    "./plugins/with-android-manifest.js",
    "./plugins/with-hermes-ios-m1-workaround.js",
    "sentry-expo",
    "./plugins/react-native-cronet.js",
    "./plugins/with-animated-webp-support.js",
    "./plugins/with-fast-image-webp-support-android.js",
    "./plugins/with-fast-image-webp-support-ios.js",
    "@logrocket/react-native",
    [
      withInfoPlist,
      (config) => {
        if (!config.modResults) {
          config.modResults = {};
        }
        config.modResults = {
          ...config.modResults,
          // Enable 120 FPS animations
          CADisableMinimumFrameDurationOnPhone: true,
        };
        return config;
      },
    ],
  ],
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
          organization: "showtime-l3",
          project: "showtime-mobile",
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
};
