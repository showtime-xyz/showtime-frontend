/**
 * @type {import('next').NextConfig}
 */

const { withExpo } = require("@expo/next-adapter");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withTM = require("next-transpile-modules")([
  "app",
  "@gorhom/bottom-sheet",
  "@gorhom/portal",
  "twrnc",
  "moti",
  "expo-next-react-navigation",
  "zeego",
  "sentry-expo",
  "solito",
  "three",
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
  "@showtime-xyz/universal.color-scheme",
  "@showtime-xyz/universal.country-code-picker",
  "@showtime-xyz/universal.color-scheme",
  "@showtime-xyz/universal.data-pill",
  "@showtime-xyz/universal.divider",
  "@showtime-xyz/universal.dropdown-menu",
  "@showtime-xyz/universal.fieldset",
  "@showtime-xyz/universal.hooks",
  "@showtime-xyz/universal.icon",
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
  "@showtime-xyz/universal.pressable-scale",
  "@showtime-xyz/universal.router",
  "@showtime-xyz/universal.safe-area",
  "@showtime-xyz/universal.scroll-view",
  "@showtime-xyz/universal.segmented-control",
  "@showtime-xyz/universal.select",
  "@showtime-xyz/universal.skeleton",
  "@showtime-xyz/universal.snackbar",
  "@showtime-xyz/universal.spinner",
  "@showtime-xyz/universal.switch",
  "@showtime-xyz/universal.text-input",
  "@showtime-xyz/universal.toast",
  "@showtime-xyz/universal.tooltip",
  "@showtime-xyz/universal.verification-badge",
  "@shopify/flash-list",
  "recyclerlistview",
]);

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  swcMinify: false,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    browsersListForSwc: true,
    legacyBrowsers: false,
    forceSwcTransforms: true,
    // concurrentFeatures: true,
    // nextScriptWorkers: true,
    swcPlugins: [[require.resolve("./plugins/swc_plugin_reanimated.wasm")]],
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
    withTM,
    withFonts,
    withImages,
    withBundleAnalyzer,
    !isDev ? withSentryConfig : null,
    [withExpo, { projectRoot: __dirname + "/../.." }],
  ].filter(Boolean),
  nextConfig
);
