const path = require("path");

module.exports = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../packages/app/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../packages/design-system/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-next",
    {
      name: "@storybook/addon-react-native-web",
      options: {
        modulesToTranspile: [
          "@gorhom/bottom-sheet",
          "@gorhom/portal",
          "twrnc",
          "moti",
          "@motify/components",
          "@motify/core",
          "zeego",
          "@showtime-xyz",
        ],
        babelPlugins: ["react-native-reanimated/plugin"],
      },
    },
  ],
  core: {
    builder: "webpack5",
  },
  typescript: { reactDocgen: false },
  webpackFinal: async (config, { configType }) => {
    config.resolve.fallback = {
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
    };
    return config;
  },
};
