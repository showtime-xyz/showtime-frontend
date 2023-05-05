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
  },
  transpilePackages: [
    "react-native-web",
    "app",
    "desing-system",
    "@showtime-xyz",
    "@gorhom/portal",
    "moti",
    "zeego",
    "sentry-expo",
    "solito",
    "nativewind",
    "expo-app-loading",
    "expo-application",
    "expo-av",
    "expo-asset",
    "expo-blur",
    "expo-clipboard",
    "expo-constants",
    "expo-dev-client",
    "expo-device",
    "expo-modules-core",
    "expo-image-picker",
    "expo-linear-gradient",
    "expo-localization",
    "expo-location",
    "expo-mail-composer",
    "expo-media-library",
    "expo-status-bar",
    "expo-system-ui",
    "expo-web-browser",
    "expo-file-system",
    "react-native-reanimated",
    "react-native-gesture-handler",
    "react-native-svg",
    "react-native-avoid-softinput",
    "react-native-safe-area-context",
    "react-native-mmkv",
    "react-native-tab-view",
    "universal-tooltip",
    "react-native-image-colors",
  ],
  webpack: (config, options) => {
    // Mix in aliases
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias direct react-native imports to react-native-web
      "react-native$": "react-native-web",
      "react-native-web/dist/cjs/exports/DrawerLayoutAndroid":
        "react-native-web/dist/cjs/modules/UnimplementedView",
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

    // this little neat function will allow us to use `bit watch` in dev and change the code from design system without
    // restarting next or clearing the next cache
    // config.snapshot = {
    //   ...(config.snapshot ?? {}),
    //   // Add all node_modules but @showtime-xyz module to managedPaths
    //   // Allows for hot refresh of changes to @showtime-xyz module
    //   managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!@showtime-xyz)/],
    // };

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
        source: "/.well-known/apple-app-site-association",
        destination: "/api/.well-known/apple-app-site-association",
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
      {
        source: "/apply",
        destination: "https://showtimexyz.typeform.com/to/pXQVhkZo",
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
        source: "/@:username/:dropSlug",
        destination: "/profile/:username/:dropSlug",
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
