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
    [
      "module-resolver",
      {
        alias: {
          crypto: "react-native-quick-crypto",
          stream: "stream-browserify",
          buffer: "@craftzdog/react-native-buffer",
          "bn.js": "react-native-bignumber",
        },
      },
    ],
    ["nativewind/babel", { mode: "compileOnly" }],
  ];

  if (process.env.NODE_ENV === "test") {
    plugins.push("dynamic-import-node");
  }

  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins,
  };
};
