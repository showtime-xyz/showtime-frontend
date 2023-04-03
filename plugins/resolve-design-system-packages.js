const path = require("path");
const fs = require("fs");
const json = require("comment-json");
const bitMap = fs.readFileSync(path.join(__dirname, "../", `.bitmap`)) || {};

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
          "../",
          `packages/design-system/${key}`,
          mainFile
        );
      }
    }
  }
  return designSystemPackages;
}
module.exports = resolveDesignSystemPackages;
