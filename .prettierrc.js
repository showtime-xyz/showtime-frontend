module.exports = {
  bracketSpacing: true,
  importOrder: [
    "./shim",
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
