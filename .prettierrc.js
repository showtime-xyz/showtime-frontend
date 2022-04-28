module.exports = {
  bracketSpacing: true,
  importOrder: [
    "./shim",
    "raf/polyfill",
    "^(react|react-native)$",
    "<THIRD_PARTY_MODULES>",
    "^app/(.*)$",
    "^design-system(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  plugins: [require("./merged-prettier-plugin")],
};
