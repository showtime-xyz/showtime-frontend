/**
 * @type {import('next').NextConfig}
 */
const isDev = process.env.NODE_ENV === "development";

const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const cache = require("./workbox-cache");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: isDev,
  runtimeCaching: cache,
});

const nextConfig = {
  swcMinify: false,
  reactStrictMode: false,
  experimental: {
    optimizeCss: true,
    browsersListForSwc: true,
    legacyBrowsers: false,
    forceSwcTransforms: true,
    // concurrentFeatures: true,
    // nextScriptWorkers: true,
    scrollRestoration: true,
    swcPlugins: [
      // ["react-native-reanimated-swc-plugin"],
      ["@nissy-dev/swc-plugin-react-native-web", { commonjs: true }],
    ],
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
    transpilePackages: [
      "react-native",
      "react-native-web",
      "app",
      "@gorhom/bottom-sheet",
      "@gorhom/portal",
      "moti",
      "zeego",
      "sentry-expo",
      "solito",
      "three",
      "nativewind",
      "@shopify/flash-list",
      "recyclerlistview",
      "expo",
      "expo-app-loading",
      "expo-application",
      "expo-av",
      "expo-asset",
      "expo-blur",
      "expo-build-properties",
      "expo-camera",
      "expo-clipboard",
      "expo-community-flipper",
      "expo-constants",
      "expo-dev-client",
      "expo-device",
      "expo-font",
      "expo-gl",
      "expo-haptics",
      "expo-image-picker",
      "expo-linear-gradient",
      "expo-linking",
      "expo-localization",
      "expo-location",
      "expo-media-library",
      "expo-modules-core",
      "expo-navigation-bar",
      "expo-next-react-navigation",
      "expo-notifications",
      "expo-splash-screen",
      "expo-status-bar",
      "expo-system-ui",
      "expo-updates",
      "expo-web-browser",
      "expo-next-react-navigation",
      "expo-file-system",
      "@react-native-menu/menu",
      "react-native-reanimated",
      "react-native-gesture-handler",
      "react-native-svg",
      "react-native-avoid-softinput",
      "react-native-safe-area-context",
      "react-native-mmkv",
      "@react-native-community/slider",
      "react-native-tab-view-next",
      "@showtime-xyz/universal.typography",
      "@showtime-xyz/universal.tailwind",
      "@showtime-xyz/universal.view",
      "@showtime-xyz/universal.text",
      "@showtime-xyz/universal.accordion",
      "@showtime-xyz/universal.activity-indicator",
      "@showtime-xyz/universal.alert",
      "@showtime-xyz/universal.avatar",
      "@showtime-xyz/universal.bottom-sheet",
      "@showtime-xyz/universal.button",
      "@showtime-xyz/universal.checkbox",
      "@showtime-xyz/universal.chip",
      "@showtime-xyz/universal.clamp-text",
      "@showtime-xyz/universal.collapsible-tab-view",
      "@showtime-xyz/universal.color-scheme",
      "@showtime-xyz/universal.country-code-picker",
      "@showtime-xyz/universal.color-scheme",
      "@showtime-xyz/universal.data-pill",
      "@showtime-xyz/universal.divider",
      "@showtime-xyz/universal.dropdown-menu",
      "@showtime-xyz/universal.fieldset",
      "@showtime-xyz/universal.haptics",
      "@showtime-xyz/universal.hooks",
      "@showtime-xyz/universal.icon",
      "@showtime-xyz/universal.infinite-scroll-list",
      "@showtime-xyz/universal.image",
      "@showtime-xyz/universal.input",
      "@showtime-xyz/universal.label",
      "@showtime-xyz/universal.light-box",
      "@showtime-xyz/universal.modal",
      "@showtime-xyz/universal.modal-screen",
      "@showtime-xyz/universal.modal-sheet",
      "@showtime-xyz/universal.pan-to-close",
      "@showtime-xyz/universal.pinch-to-zoom",
      "@showtime-xyz/universal.pressable",
      "@showtime-xyz/universal.pressable-hover",
      "@showtime-xyz/universal.pressable-scale",
      "@showtime-xyz/universal.router",
      "@showtime-xyz/universal.safe-area",
      "@showtime-xyz/universal.scroll-view",
      "@showtime-xyz/universal.select",
      "@showtime-xyz/universal.skeleton",
      "@showtime-xyz/universal.snackbar",
      "@showtime-xyz/universal.spinner",
      "@showtime-xyz/universal.switch",
      "@showtime-xyz/universal.text-input",
      "@showtime-xyz/universal.tab-view",
      "@showtime-xyz/universal.toast",
      "@showtime-xyz/universal.tooltip",
      "@showtime-xyz/universal.utils",
      "@showtime-xyz/universal.verification-badge",
      "universal-tooltip",
    ],
  },
  webpack: (config, options) => {
    // Mix in aliases
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias direct react-native imports to react-native-web
      "react-native$": "react-native-web",
      // Alias internal react-native modules to react-native-web
      "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$":
        "react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter",
      "react-native/Libraries/vendor/emitter/EventEmitter$":
        "react-native-web/dist/vendor/react-native/emitter/EventEmitter",
      "react-native/Libraries/EventEmitter/NativeEventEmitter$":
        "react-native-web/dist/vendor/react-native/NativeEventEmitter",
    };

    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...(config.resolve?.extensions ?? []),
    ];

    if (!config.plugins) {
      config.plugins = [];
    }

    // Expose __DEV__ from Metro.
    config.plugins.push(
      new options.webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
      })
    );

    return config;
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  outputFileTracing: false, // https://github.com/vercel/next.js/issues/30601#issuecomment-961323914
  images: {
    disableStaticImages: true,
    domains: [
      "lh3.googleusercontent.com",
      "cloudflare-ipfs.com",
      "cdn.tryshowtime.com",
      "storage.googleapis.com",
      "testingservice-dot-showtimenft.wl.r.appspot.com",
    ],
  },
  async headers() {
    const cacheHeaders = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/_next/static/:static*", headers: cacheHeaders },
      { source: "/fonts/:font*", headers: cacheHeaders },
    ];
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/FBSxXrcnsm",
        permanent: true,
      },
      {
        source: "/t/:path*",
        destination: "/nft/:path*",
        permanent: true,
      },
      {
        source: "/token/:path*",
        destination: "/nft/:path*",
        permanent: true,
      },
      {
        source: "/.well-known/:file",
        destination: "/api/.well-known/:file",
        permanent: false,
      },
      {
        source: "/app-store",
        destination:
          "https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688",
        permanent: true,
      },
      {
        source: "/google-play",
        destination:
          "https://play.google.com/store/apps/details?id=io.showtime",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/@:username",
        destination: "/profile/:username",
      },
      {
        source: "/login",
        destination: "/?login=true",
      },
    ];
  },
};

module.exports = withPlugins(
  [
    withImages,
    withBundleAnalyzer,
    !isDev ? withSentryConfig : null,
    withPWA,
  ].filter(Boolean),
  nextConfig
);
