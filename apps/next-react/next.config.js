/**
 * @type {import('next').NextConfig}
 */

const { withExpo } = require("@expo/next-adapter");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const withSentryConfig = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withTM = require("next-transpile-modules")([
  "app",
  "@gorhom/bottom-sheet",
  "@gorhom/portal",
  "dripsy",
  "@dripsy/core",
  "@dripsy/gradient",
  "twrnc",
  "moti",
  "@motify/components",
  "@motify/core",
  "expo-next-react-navigation",
  "@zeego/menu",
  "@zeego/dropdown-menu",
]);

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  experimental: {
    optimizeCss: true,
    esmExternals: "loose",
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS,
  outputFileTracing: false, // https://github.com/vercel/next.js/issues/30601#issuecomment-961323914
  images: {
    disableStaticImages: true,
    domains: [
      "lh3.googleusercontent.com",
      "cloudflare-ipfs.com",
      "cdn.tryshowtime.com",
      "storage.googleapis.com",
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
        source: "/feedback",
        destination: "https://showtime.nolt.io",
        permanent: true,
      },
      {
        source: "/0x3a99ea152Dd2eAcc8E95aDdFb943e714Db9ECC22",
        destination: "/ukraine",
        permanent: true,
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
