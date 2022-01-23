import "dotenv/config";

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

export default {
  name: "Showtime",
  description: "The web3 social network",
  slug: "showtime",
  scheme: config.scheme,
  owner: "tryshowtime",
  icon: config.icon,
  version: "1.0.0",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  ios: {
    bundleIdentifier: config.scheme,
    buildNumber: "1.0.0",
    supportsTablet: true,
    jsEngine: "hermes",
    backgroundColor: "#FFFFFF",
  },
  android: {
    package: config.scheme,
    versionCode: 1,
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
  runtimeVersion: {
    policy: "sdkVersion", // https://docs.expo.dev/eas-update/runtime-versions/
  },
  extra: {
    STAGE: process.env.STAGE,
    eas: {
      projectId: "45cbf5d5-24fe-4aa6-9580-acf540651abd",
    },
  },
  plugins: [
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
  ],
};
