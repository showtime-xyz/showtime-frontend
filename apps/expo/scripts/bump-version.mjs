#!/usr/bin/env zx
import "zx/globals";

const applicationPackage = require("../../../package.json");

const hasPlatform = (fileDiffList, reactNativeConfig, configuration) => {
  const checkIos = configuration.ios;
  const checkAndroid = configuration.android;

  // Reference file for ios validation cc: L3-5, 40-50
  // https://github.com/react-native-community/cli/blob/master/packages/platform-ios/native_modules.rb
  if (checkIos) {
    const hasIos = fileDiffList.find((packageKey) => {
      const nativeDependencies = reactNativeConfig.dependencies;
      const hasMapping = Boolean(nativeDependencies[packageKey]);

      if (hasMapping) {
        console.log(
          `The dependency ${chalk.green(
            packageKey
          )} was found in the ios react native config`
        );
        return Boolean(
          nativeDependencies[packageKey].platforms.ios.podspecPath
        );
      }
    });
    return hasIos;
  }

  // Reference file for android validation cc: L243, 262-263, 265
  // https://github.com/react-native-community/cli/blob/master/packages/platform-android/native_modules.gradle#L262
  if (checkAndroid) {
    const hasAndroid = fileDiffList.find((packageKey) => {
      const nativeDependencies = reactNativeConfig.dependencies;
      const hasMapping = Boolean(nativeDependencies[packageKey]);

      if (hasMapping) {
        console.log(
          `The dependency ${chalk.green(
            packageKey
          )} was found in the android react native config`
        );
        return Boolean(
          nativeDependencies[packageKey].platforms.android?.sourceDir
        );
      }
    });
    return hasAndroid;
  }
};

const bumpVersion = async (versionType) => {
  const inCI = process.env.CI;
  if (inCI) {
    const versionUpdateResponse =
      await $`npx bumpp ${versionType} --all --commit "release v" --tag "v" --push --yes`;
    console.log(versionUpdateResponse);
    const newVersion = versionUpdateResponse.stdout
      .split("✔")[1]
      .replace("Updated package.json to ", "")
      .trim();
    console.log(`${chalk.green(newVersion)}`);

    // Use the version type in the GitHub Action to trigger
    // an EAS Update (patch) or an EAS Build (major)
    console.log(`::set-output name=type::${versionType}`);
  } else {
    console.log(
      "Not running in CI, script will by default skip bumping, commits and pushes"
    );
  }
};

try {
  $.verbose = false;

  // Retrieve the first arg when running `yarn bump-application-version major`
  const versionType = process.argv[3] ?? "patch";
  const rootPath = "./apps/expo";
  const monorepoRootPath = "../..";
  const dirtyPath = "apps/expo/package.json";
  const reactNativeConfigPath = "../../node_modules/.bin/react-native";
  const currentApplicationVersion = applicationPackage.version;

  // As a monorepo the version must be bumped from the root directory not the working project
  const startingWorkingDirectory = await $`pwd`;
  cd(monorepoRootPath);
  const currentWorkingDirectory = await $`pwd`;

  console.log(
    `The starting working directory is ${chalk.blue(startingWorkingDirectory)}`
  );
  console.log(
    `The current working directory is ${chalk.blue(currentWorkingDirectory)}`
  );

  const lastReleaseCommitIdResponse =
    await $`git log -1 --grep=release --pretty=format:%h`;
  const lastReleaseCommitId = lastReleaseCommitIdResponse.stdout;

  const currentCommitHeadIdResponse = await $`git log -1 --pretty=format:%h`;
  const currentCommitHeadId = currentCommitHeadIdResponse.stdout;

  // const sameCommit = lastReleaseCommitId === currentCommitHeadId;

  console.log(`Current Commit ID: ${chalk.blue(currentCommitHeadId)}\n`);
  console.log(`Last Release Commit ID: ${chalk.blue(lastReleaseCommitId)}\n`);

  // if (sameCommit) {
  //   console.log("No new commits since the last release, no action needed");
  //   // Exit code 1 to fail the GitHub Action and prevent an unnecessary deployment
  //   await $`exit 1`;
  // }

  // Force a major version bump
  if (versionType === "major") {
    console.log(
      `The application will update as a ${chalk.green(
        "major"
      )} from version ${chalk.green(currentApplicationVersion)}`
    );
    await bumpVersion("major");
  } else {
    /**
     * If file at path "apps/expo/package.json" has been modified within the commit range then it's possible
     * a native module has been added. If file path was not modified then a safe assumption to bump as patch can be made.
     *
     * Has native changes -> Increment major version
     * No native changes -> Increment patch version
     *
     */
    // Commit order matters for diff, previous then latest commit id
    const fileNameDiffResponse =
      await $`git diff ${lastReleaseCommitId} ${currentCommitHeadId} --name-only`;
    const fileNameDiff = fileNameDiffResponse.stdout.split("\n");
    const hasPossiblePackageChanges = Boolean(
      fileNameDiff.find((fileName) => fileName === dirtyPath)
    );

    if (hasPossiblePackageChanges) {
      console.log(
        `Since last release there have ${chalk.green(
          "been"
        )} changes to ${chalk.green(dirtyPath)}`
      );

      // Returns the string diff of the package.json with just the lines added and removed
      const fileDiffResponse =
        await $`git diff ${lastReleaseCommitId} ${currentCommitHeadId} --unified=0 ${dirtyPath} | grep '^[+|-][^+|-]'`;
      // Sanitizes the diff string into an array of strings that are the "keys" for just added lines
      const fileDiffSanitized = fileDiffResponse.stdout
        .split("\n")
        .filter((diff) => diff.charAt(0) === "+")
        .map((diff) => diff.substring(diff.indexOf('"') + 1))
        .map((diff) => diff.substring(0, diff.indexOf('"')));

      console.log(
        `Keys added in ${dirtyPath} since last release are: \n${chalk.green(
          fileDiffSanitized.join("\n")
        )}`
      );

      // React Native config has to be invoked within the expo directory
      cd(rootPath);

      const reactNativeConfigResponse =
        await $`${reactNativeConfigPath} config`;
      const reactNativeConfig = JSON.parse(reactNativeConfigResponse.stdout);

      const hasIos = hasPlatform(fileDiffSanitized, reactNativeConfig, {
        ios: true,
      });
      const hasAndroid = hasPlatform(fileDiffSanitized, reactNativeConfig, {
        android: true,
      });

      cd(monorepoRootPath);

      if (hasIos || hasAndroid) {
        console.log(
          `The application will update as a ${chalk.green(
            "major"
          )} from version ${chalk.green(currentApplicationVersion)}`
        );
        await bumpVersion("major");
      } else {
        console.log(
          `The application will update as a ${chalk.green(
            "patch"
          )} from version ${chalk.green(currentApplicationVersion)}`
        );
        await bumpVersion("patch");
      }
    } else {
      console.log(`The last release had no changes to ${dirtyPath}`);
      console.log(
        `The application will update as a ${chalk.green(
          "patch"
        )} from version ${chalk.green(currentApplicationVersion)}`
      );
      await bumpVersion("patch");
    }
  }
} catch (error) {
  console.error(`Error: ${error}`);
  await $`exit ${error.exitCode}`;
}
