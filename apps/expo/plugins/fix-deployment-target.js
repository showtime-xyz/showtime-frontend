// Credit: https://github.com/facebook/react-native/issues/34106#issuecomment-1493040686
// This plugin is used to fix the deployment target issue in iOS
const { withDangerousMod, withPlugins } = require("@expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const withFixedDeploymentTarget = (c) => {
  return withDangerousMod(c, [
    "ios",
    async (config) => {
      const file = resolve(config.modRequest.platformProjectRoot, "Podfile");
      const contents = readFileSync(file, { encoding: "utf-8" });
      writeFileSync(file, fixDeploymentTarget(contents));
      return config;
    },
  ]);
};

function fixDeploymentTarget(src) {
  return mergeContents({
    tag: `rn-fix-deployment-target`,
    src,
    newSrc: `
  installer.pods_project.targets.each do |target|
    if target.to_s === 'React-Codegen'
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '5.0'
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end
  end
`,
    anchor: /post_install/,
    offset: 1,
    comment: "#",
  }).contents;
}

module.exports = (config) => withPlugins(config, [withFixedDeploymentTarget]);
