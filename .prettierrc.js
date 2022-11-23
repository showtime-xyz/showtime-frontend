module.exports = {
  bracketSpacing: true,
  importOrder: [
    "./shim",
    "core-js/stable",
    "raf/polyfill",
    "setimmediate",
    "^(react|react-native)$",
    "<THIRD_PARTY_MODULES>",
    "^@showtime(.*)$",
    "^app/(.*)$",
    "^design-system(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  plugins: [require("./merged-prettier-plugin")],
};
