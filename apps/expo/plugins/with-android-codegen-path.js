const { withAppBuildGradle } = require("@expo/config-plugins");

/*
 * We need to add the codegenDir to the build.gradle file in the react section.
 * The react-native-codegen package is located in the root node_modules dir.
 * Otherwise the react-native-gradle-plugin would look for it in the
 * /apps/expo/node_modules dir, which causes troubles as its not there.
 */

const withAndroidCodegenPath = (config) => {
  function addCodegenPath(buildGradle) {
    const newLine = `    codegenDir = new File(["node", "--print", "require.resolve('react-native-codegen/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()\n`;

    if (buildGradle.includes(newLine)) return buildGradle;

    const regex = /reactNativeDir =.*\n/;
    const modifiedBuildGradle = buildGradle.replace(regex, `$&${newLine}`);
    if (modifiedBuildGradle.length === buildGradle.length) {
      throw new Error(
        "withAndroidCodegenPath: Could not find where to add codegenDir"
      );
    }
    return modifiedBuildGradle;
  }

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addCodegenPath(config.modResults.contents);
    } else {
      throw new Error(
        "withAndroidCodegenPath: Can't modify because app build.gradle is not groovy"
      );
    }
    return config;
  });
};

module.exports = withAndroidCodegenPath;
