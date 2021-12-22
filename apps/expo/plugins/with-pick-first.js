// From https://forums.expo.dev/t/eas-build-fails-for-android-execution-failed-for-task-mergereleasenativelibs/56633/15

const { withAppBuildGradle, withPlugins } = require("@expo/config-plugins");

function addPickFirst(buildGradle, paths) {
  const regexpPackagingOptions = /\bpackagingOptions\s*{[^}]*}/;
  const packagingOptionsMatch = buildGradle.match(regexpPackagingOptions);

  let bodyLines = [];
  paths.forEach((path) => {
    bodyLines.push(`        pickFirst '${path}'`);
  });
  let body = bodyLines.join("\n");

  if (packagingOptionsMatch) {
    console.warn(
      "WARN: withPickFirst: Replacing packagingOptions in app build.gradle"
    );
    return buildGradle.replace(
      regexpPackagingOptions,
      `packagingOptions {
${body}
    }`
    );
  }

  const regexpAndroid = /\nandroid\s*{/;
  const androidMatch = buildGradle.match(regexpAndroid);

  if (androidMatch) {
    return buildGradle.replace(
      regexpAndroid,
      `
android {
    packagingOptions {
${body}
    }`
    );
  }

  throw new Error(
    "withPickFirst: Could not find where to add packagingOptions"
  );
}

const withPickFirst = (config, props = {}) => {
  if (!props.paths) {
    throw new Error("withPickFirst: No paths specified!");
  }
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addPickFirst(
        config.modResults.contents,
        props.paths
      );
    } else {
      throw new Error(
        "withPickFirst: Can't add pickFirst(s) because app build.gradle is not groovy"
      );
    }
    return config;
  });
};

module.exports = (config, props) =>
  withPlugins(config, [[withPickFirst, props]]);
