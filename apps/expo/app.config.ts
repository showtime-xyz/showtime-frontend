import type { ExpoConfig } from "@expo/config-types";
import { ExportedConfigWithProps } from "expo/config-plugins";

const path = require("path");
const STAGE = process.env.STAGE ?? "production";
const envPath = path.resolve(__dirname, `.env.${STAGE}`);

const { withInfoPlist } = require("@expo/config-plugins");

type EnvConfig = {
  [key: string]: {
    scheme: string;
    icon: string;
    foregroundImage: string;
    backgroundImage: string;
  };
};

const url = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;

const packageJSON = require("../../package.json");

const semver = require("semver");
require("@expo/env").load(envPath);

const SCHEME = process.env.SCHEME ?? "io.showtime";

const envConfig: EnvConfig = {
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

const expoConfig: ExpoConfig = {
  name: "Showtime",
  description: "The web3 social network",
  slug: "showtime",
  scheme: config.scheme,
  owner: "showtime-xyz",
  icon: config.icon,
  version: version.toString(),
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: config.scheme,
    buildNumber: majorVersion.toString(),
    supportsTablet: false, // TODO:
    jsEngine: "hermes",
    backgroundColor: "#FFFFFF",
    config: {
      usesNonExemptEncryption: false,
    },
    bitcode: false, // or "Debug",
    associatedDomains: [`applinks:${url}`],
    splash: {
      image: "./assets/splash-ios.png",
      resizeMode: "cover",
    },
  },
  android: {
    package: config.scheme,
    versionCode: majorVersion,
    splash: {
      image: "./assets/splash-android.png",
      resizeMode: "cover",
    },
    adaptiveIcon: {
      foregroundImage: config.foregroundImage,
      backgroundImage: config.backgroundImage,
      monochromeImage: "./assets/mono-icon.png",
    },
    jsEngine: "hermes",
    softwareKeyboardLayoutMode: "resize",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: `*.${url}`,
            pathPrefix: "/",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
      {
        action: "VIEW",
        category: ["BROWSABLE", "DEFAULT"],
        data: {
          scheme: config.scheme,
        },
      },
    ],
    googleServicesFile: STAGE === "production" ? "./google-services.json" : "",
  },
  androidNavigationBar: {
    barStyle: "dark-content",
    backgroundColor: "#FFFFFF",
  },
  androidStatusBar: {
    backgroundColor: "#00000000",
    barStyle: "light-content",
  },
  notification: {
    icon: "./assets/notification-icon.png",
    color: "#EBB64F",
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
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
    "expo-localization",
    [
      "expo-image-picker",
      {
        photosPermission:
          "$(PRODUCT_NAME) needs to access your camera roll so that you can upload photos on Showtime.",
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
    "sentry-expo",
    "./plugins/with-spotify-sdk.js",
    "./plugins/with-android-splash-screen.js",
    "./plugins/with-disabled-force-dark-mode.js",
    [
      withInfoPlist,
      (config: ExportedConfigWithProps) => {
        if (!config.modResults) {
          config.modResults = {};
        }
        config.modResults = {
          ...config.modResults,
          // Enable 120 FPS animations
          CADisableMinimumFrameDurationOnPhone: true,
          // let RNS handle status bar management
          UIViewControllerBasedStatusBarAppearance: true,
          LSApplicationQueriesSchemes: [
            "mailto",
            "instagram",
            "instagram-stories",
            "fb",
            "facebook-stories",
            "twitter",
          ],
        };
        return config;
      },
    ],
    [
      "@bacons/link-assets",
      [
        "./assets/fonts/Inter-Bold.otf",
        "./assets/fonts/Inter-Medium.otf",
        "./assets/fonts/Inter-Regular.otf",
        "./assets/fonts/Inter-SemiBold.otf",
      ],
    ],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 33,
          targetSdkVersion: 33,
          minSdkVersion: 23,
          buildToolsVersion: "33.0.0",
          kotlinVersion: "1.8.0",
          unstable_networkInspector: true,
        },
        ios: {
          deploymentTarget: "13.0",
          unstable_networkInspector: true,
        },
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

export default expoConfig;
