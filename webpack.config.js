const WebpackModules = require("webpack-modules");

module.exports = {
  plugins: [new WebpackModules()],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      // Must be below test-utils
    },
  },
};
