const path = require("path");
const fs = require("fs");

const STAGE = process.env.STAGE ?? "production";
const envPath = path.resolve(__dirname, `.env.${STAGE}`);

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
          "@showtime-xyz/universal.tailwind": path.join(
            __dirname,
            "../../",
            "packages/design-system/tailwind",
            "index.ts"
          ),
          "@showtime-xyz/universal.view": path.join(
            __dirname,
            "../../",
            "packages/design-system/view",
            "index.tsx"
          ),
          "@showtime-xyz/universal.text": path.join(
            __dirname,
            "../../",
            "packages/design-system/text",
            "index.tsx"
          ),
          "@showtime-xyz/universal.accordion": path.join(
            __dirname,
            "../../",
            "packages/design-system/accordion",
            "index.tsx"
          ),
          "@showtime-xyz/universal.alert": path.join(
            __dirname,
            "../../",
            "packages/design-system/alert",
            "index.tsx"
          ),
          "@showtime-xyz/universal.avatar": path.join(
            __dirname,
            "../../",
            "packages/design-system/avatar",
            "index.tsx"
          ),
          "@showtime-xyz/universal.bottom-sheet": path.join(
            __dirname,
            "../../",
            "packages/design-system/bottom-sheet",
            "index.tsx"
          ),
          "@showtime-xyz/universal.button": path.join(
            __dirname,
            "../../",
            "packages/design-system/button",
            "index.tsx"
          ),
          "@showtime-xyz/universal.checkbox": path.join(
            __dirname,
            "../../",
            "packages/design-system/checkbox",
            "index.tsx"
          ),
          "@showtime-xyz/universal.chip": path.join(
            __dirname,
            "../../",
            "packages/design-system/chip",
            "index.tsx"
          ),
          "@showtime-xyz/universal.clamp-text": path.join(
            __dirname,
            "../../",
            "packages/design-system/clamp-text",
            "index.ts"
          ),
          "@showtime-xyz/universal.collapsible-tab-view": path.join(
            __dirname,
            "../../",
            "packages/design-system/collapsible-tab-view",
            "index.tsx"
          ),
          "@showtime-xyz/universal.country-code-picker": path.join(
            __dirname,
            "../../",
            "packages/design-system/country-code-picker",
            "index.tsx"
          ),
          "@showtime-xyz/universal.color-scheme": path.join(
            __dirname,
            "../../",
            "packages/design-system/color-scheme",
            "index.ts"
          ),
          "@showtime-xyz/universal.data-pill": path.join(
            __dirname,
            "../../",
            "packages/design-system/data-pill",
            "index.tsx"
          ),
          "@showtime-xyz/universal.divider": path.join(
            __dirname,
            "../../",
            "packages/design-system/divider",
            "index.tsx"
          ),
          "@showtime-xyz/universal.fieldset": path.join(
            __dirname,
            "../../",
            "packages/design-system/fieldset",
            "index.tsx"
          ),
          "@showtime-xyz/universal.haptics": path.join(
            __dirname,
            "../../",
            "packages/design-system/haptics",
            "index.ts"
          ),
          "@showtime-xyz/universal.hooks": path.join(
            __dirname,
            "../../",
            "packages/design-system/hooks",
            "index.ts"
          ),
          "@showtime-xyz/universal.icon": path.join(
            __dirname,
            "../../",
            "packages/design-system/icon",
            "index.ts"
          ),
          "@showtime-xyz/universal.infinite-scroll-list": path.join(
            __dirname,
            "../../",
            "packages/design-system/infinite-scroll-list",
            "index.ts"
          ),
          "@showtime-xyz/universal.image": path.join(
            __dirname,
            "../../",
            "packages/design-system/image",
            "index.tsx"
          ),
          "@showtime-xyz/universal.input": path.join(
            __dirname,
            "../../",
            "packages/design-system/input",
            "index.tsx"
          ),
          "@showtime-xyz/universal.label": path.join(
            __dirname,
            "../../",
            "packages/design-system/label",
            "index.tsx"
          ),
          "@showtime-xyz/universal.light-box": path.join(
            __dirname,
            "../../",
            "packages/design-system/light-box",
            "index.tsx"
          ),
          "@showtime-xyz/universal.modal": path.join(
            __dirname,
            "../../",
            "packages/design-system/modal",
            "index.tsx"
          ),
          "@showtime-xyz/universal.modal-screen": path.join(
            __dirname,
            "../../",
            "packages/design-system/modal-screen",
            "index.ts"
          ),
          "@showtime-xyz/universal.modal-sheet": path.join(
            __dirname,
            "../../",
            "packages/design-system/modal-sheet",
            "index.ts"
          ),
          "@showtime-xyz/universal.pan-to-close": path.join(
            __dirname,
            "../../",
            "packages/design-system/pan-to-close",
            "index.tsx"
          ),
          "@showtime-xyz/universal.pinch-to-zoom": path.join(
            __dirname,
            "../../",
            "packages/design-system/pinch-to-zoom",
            "index.ts"
          ),
          "@showtime-xyz/universal.pressable": path.join(
            __dirname,
            "../../",
            "packages/design-system/pressable",
            "index.tsx"
          ),
          "@showtime-xyz/universal.pressable-hover": path.join(
            __dirname,
            "../../",
            "packages/design-system/pressable-hover",
            "index.tsx"
          ),
          "@showtime-xyz/universal.pressable-scale": path.join(
            __dirname,
            "../../",
            "packages/design-system/pressable-scale",
            "index.tsx"
          ),
          "@showtime-xyz/universal.router": path.join(
            __dirname,
            "../../",
            "packages/design-system/router",
            "index.ts"
          ),
          "@showtime-xyz/universal.safe-area": path.join(
            __dirname,
            "../../",
            "packages/design-system/safe-area",
            "index.ts"
          ),
          "@showtime-xyz/universal.scroll-view": path.join(
            __dirname,
            "../../",
            "packages/design-system/scroll-view",
            "index.tsx"
          ),
          "@showtime-xyz/universal.select": path.join(
            __dirname,
            "../../",
            "packages/design-system/select",
            "index.ts"
          ),
          "@showtime-xyz/universal.skeleton": path.join(
            __dirname,
            "../../",
            "packages/design-system/skeleton",
            "index.tsx"
          ),
          "@showtime-xyz/universal.snackbar": path.join(
            __dirname,
            "../../",
            "packages/design-system/snackbar",
            "index.tsx"
          ),
          "@showtime-xyz/universal.spinner": path.join(
            __dirname,
            "../../",
            "packages/design-system/spinner",
            "index.ts"
          ),
          "@showtime-xyz/universal.switch": path.join(
            __dirname,
            "../../",
            "packages/design-system/switch",
            "index.tsx"
          ),
          "@showtime-xyz/universal.text-input": path.join(
            __dirname,
            "../../",
            "packages/design-system/text-input",
            "index.tsx"
          ),
          "@showtime-xyz/universal.tab-view": path.join(
            __dirname,
            "../../",
            "packages/design-system/tab-view",
            "index.tsx"
          ),
          "@showtime-xyz/universal.tooltip": path.join(
            __dirname,
            "../../",
            "packages/design-system/tooltip",
            "index.tsx"
          ),
          "@showtime-xyz/universal.utils": path.join(
            __dirname,
            "../../",
            "packages/design-system/utils",
            "index.tsx"
          ),
          "@showtime-xyz/universal.verification-badge": path.join(
            __dirname,
            "../../",
            "packages/design-system/verification-badge",
            "index.tsx"
          ),
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
