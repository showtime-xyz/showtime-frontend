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
    resizeMode: "cover",
    backgroundColor: "#FFFFFF",
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
  },
  extra: {
    STAGE: process.env.STAGE,
  },
  plugins: [
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
        enableMicrophonePermission: true,
        microphonePermissionText:
          "$(PRODUCT_NAME) needs access to your Microphone.",
        disableFrameProcessors: true,
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
  ],
};
