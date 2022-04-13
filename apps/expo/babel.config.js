const path = require("path");

module.exports = function (api) {
  api.cache(true);

  const STAGE = process.env.STAGE ?? "production";
  const envPath = path.resolve(__dirname, `.env.${STAGE}`);
  require("dotenv").config({
    path: envPath,
  });

  let plugins = [
    ["inline-dotenv", { path: envPath }],
    "react-native-reanimated/plugin",
  ];

  if (process.env.NODE_ENV === "test") {
    plugins.push("dynamic-import-node");
  }

  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins,
  };
};
