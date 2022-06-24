var fs = require("fs");
const path = require("path");

// TODO: delete this thing
const rainbowkit = path.resolve(
  __dirname,
  "node_modules",
  "@rainbow-me/rainbowkit/dist/chunk-S7EOD33A.js"
);

const data = fs.readFileSync(rainbowkit, { encoding: "utf-8" });
const result = data.replace(
  `window.open(mobileUri, "_blank", "noreferrer,noopener");`,
  "window.location.href = mobileUri;"
);

fs.writeFileSync(rainbowkit, result, { encoding: "utf-8" });
