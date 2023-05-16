const {
  resolveDesignSystemPackages,
} = require("../../plugins/resolve-design-system-packages");

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            ...resolveDesignSystemPackages(),
          },
        },
      ],
      ["nativewind/babel", { mode: "compileOnly" }],
    ],
  };
};
