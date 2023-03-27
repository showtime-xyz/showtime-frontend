const path = require("path");
const fs = require("fs");
const json = require("comment-json");

const STAGE = process.env.STAGE ?? "production";
const envPath = path.resolve(__dirname, `.env.${STAGE}`);
const bitMap = fs.readFileSync(path.join(__dirname, "../../", `.bitmap`)) || {};

/**
 * This will allow us to always import local packages into our native project
 */
function resolveDesignSystemPackages() {
  const bitMapObj = json.parse(bitMap.toString("utf8"), undefined, true);
  const designSystemPackages = {};
  for (const key in bitMapObj) {
    if (Object.hasOwnProperty.call(bitMapObj, key)) {
      const mainFile = bitMapObj[key]?.mainFile;
      if (mainFile) {
        designSystemPackages[`@showtime-xyz/universal.${key}`] = path.join(
          __dirname,
          "../../",
          `packages/design-system/${key}`,
          mainFile
        );
      }
    }
  }
  return designSystemPackages;
}

// TODO: don't know any better way to do this! We need to add E2E variable in RN env.
if (process.env.E2E) {
  fs.appendFileSync(envPath, "\nE2E=true");
}

module.exports = function (api) {
  api.cache(true);

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
          ...resolveDesignSystemPackages(),
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
