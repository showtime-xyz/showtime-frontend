const path = require("path");
const webpack = require("webpack");

const getModule = (name) => path.join("node_modules", name);
const INCLUDES = [
  getModule("react-native"),
  getModule("expo"),
  getModule("unimodules"),
  getModule("@react"),
  getModule("@expo"),
  getModule("@gorhom/portal"),
  getModule("moti"),
  getModule("zeego"),
  getModule("nativewind"),
  getModule("@showtime-xyz"),
  getModule("react-native-tab-view"),
];
const EXCLUDES = [
  "/node_modules",
  "/bower_components",
  "/.expo/",
  // Prevent transpiling webpack generated files.
  "(webpack)",
];
module.exports = {
  stories: ["../../../packages/design-system/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // speeds up storybook build time
      allowSyntheticDefaultImports: false,
      // speeds up storybook build time
      esModuleInterop: false,
      // makes union prop types like variant and size appear as select controls
      shouldExtractLiteralValuesFromEnum: true,
      // makes string and boolean types that can be undefined appear as inputs and switches
      shouldRemoveUndefinedFromOptional: true,
    },
  },
  webpackFinal: async (config, { configType, ...rest }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        ),
        __DEV__: process.env.NODE_ENV !== "production" || true,
      })
    );
    config.plugins.push(new webpack.DefinePlugin({ process: { env: {} } }));
    const root = path.join(__dirname, "../../../");

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      loader: "babel-loader",
      include(filename) {
        if (!filename) {
          return false;
        }

        for (const possibleModule of INCLUDES) {
          if (filename.includes(path.normalize(possibleModule))) {
            return true;
          }
        }

        if (filename.includes(root)) {
          for (const excluded of EXCLUDES) {
            if (filename.includes(path.normalize(excluded))) {
              return false;
            }
          }
          return true;
        }
        return false;
      },
      options: {
        presets: [
          [
            "@babel/preset-typescript",
            {
              runtime: "automatic",
            },
          ],
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
            },
          ],
        ],
        plugins: [
          "@babel/plugin-proposal-class-properties",
          "@babel/plugin-proposal-export-namespace-from",
        ],
      },
    });

    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];

    config.resolve.alias = {
      "react-native$": "react-native-web",
      ...config.resolve.alias,
    };
    return config;
  },
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
};
