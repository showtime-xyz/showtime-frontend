#!/usr/bin/env zx
import "zx/globals";
const applicationPackage = require('../../../package.json')

// TODO: Implement flags to force a patch, minor or major

try {
  $.verbose = false
  const inCI = process.env.CI;
  const rootPath = "./apps/expo"
  const dirtyPath = "apps/expo/package.json";
  const reactNativeConfigPath = "./node_modules/.bin/react-native"
  const currentApplicationVersion = applicationPackage.version

  // As a monorepo the version must be bumped from the root directory not the working project.
  const startingWorkingDirectory = await $`pwd`
  cd('../..')
  const currentWorkingDirectory = await $`pwd`

  console.log(`The starting working directory is ${chalk.blue(startingWorkingDirectory)}`)
  console.log(`The current working directory is ${chalk.blue(currentWorkingDirectory)}`)

  // TODO: After initial release, update the grep specificity to match auto generated commit 
  const lastReleaseCommitIdResponse = await $`git log -1 --grep=version --pretty=format:%h`
  const lastReleaseCommitId = lastReleaseCommitIdResponse.stdout

  const currentCommitHeadIdResponse = await $`git log -1 --pretty=format:%h`
  const currentCommitHeadId = currentCommitHeadIdResponse.stdout

  const sameCommit = lastReleaseCommitId === currentCommitHeadId

  console.log(`Current Commit ID: ${chalk.blue(currentCommitHeadId)}`)
  console.log(`Last Release Commit ID: ${chalk.blue(lastReleaseCommitId)}`)

  if (sameCommit) {
    console.log("No new commits since the last release, no action needed")
    await $`exit 1`
  }

  /**
   * If file at path "apps/expo/package.json" has been modified within the commit range then it's possible
   * a native module has been added. If file path was not modified then a safe assumption to bump as patch can be made. 
   * 
   * Has native changes -> Increment major version
   * No native changes -> Increment patch version
   * 
   */
  // Order matters for diff, previous then latest diff.
  const fileNameDiffResponse = await $`git diff ${lastReleaseCommitId} ${currentCommitHeadId} --name-only`
  const fileNameDiff = fileNameDiffResponse.stdout.split("\n");
  const hasPossiblePackageChanges = Boolean(fileNameDiff.find((fileName) => fileName === dirtyPath))

  // if (hasPossiblePackageChanges) {
    if (hasPossiblePackageChanges) {
      console.log(`Since last release there have ${chalk.green("been")} changes to ${chalk.green(dirtyPath)}`)
    // possible major or can still be minor
    const fileDiffResponse = await $`git diff ${lastReleaseCommitId} ${currentCommitHeadId}  --unified=0 ${dirtyPath} | grep '^[+|-][^+|-]'`
    const fileDiffSanitized = fileDiffResponse.stdout
      .split('\n')
      .filter((diff) => diff.charAt(0) === "+")
      .map((diff) => diff.substring(diff.indexOf('"') + 1))
      .map((diff) => diff.substring(0, diff.indexOf('"')))

      console.log(`Keys added in ${dirtyPath} since last release are: \n${chalk.green(fileDiffSanitized.join('\n'))}`)

      cd(rootPath)

      const reactNativeConfigResponse = await $`${reactNativeConfigPath} config`
      const reactNativeConfig = JSON.parse(reactNativeConfigResponse.stdout)
      // https://github.com/react-native-community/cli/blob/master/packages/platform-ios/native_modules.rb#L42
      reactNativeConfig.dependencies

      const hasIos = fileDiffSanitized.find((packageKey) => {
        const nativeDependencies = reactNativeConfig.dependencies;
        const hasMapping = Boolean(nativeDependencies[packageKey]);

        if (hasMapping) {
          console.log(`The dependency ${chalk.green(packageKey)} was found in react native config`)
console.log(nativeDependencies[packageKey]["platforms"]["ios"])
          return Boolean(nativeDependencies[packageKey].platforms.ios.podspecPath)
        }
      })
      console.log('hasIos', hasIos)
      // https://github.com/react-native-community/cli/blob/master/packages/platform-android/native_modules.gradle#L262
      const hasAndroid = fileDiffSanitized.find((packageKey) => {
        const nativeDependencies = reactNativeConfig.dependencies;
        const hasMapping = Boolean(nativeDependencies[packageKey]);

        if (hasMapping) {
          console.log(`The dependency ${chalk.green(packageKey)} was found in react native config`)
console.log(nativeDependencies[packageKey].platforms.android.sourceDir)
          return Boolean(nativeDependencies[packageKey].platforms.android.sourceDir)
        }
      })
      console.log('hasAndroid', hasAndroid)

      if (hasIos || hasAndroid) {
        // major
        if (inCI) {
          await $`yarn config set version-git-message "chore: version major update v%s"`
          const versionUpdateResponse = await $`yarn version --major`
          console.log(`${chalk.green(versionUpdateResponse.stdout)}`)
          
          const gitPushResponse = await $`git push`
          console.log(gitPushResponse.stdout)
        }
      } else {
        if (inCI) {
          await $`yarn config set version-git-message "chore: version minor update v%s"`
          const versionUpdateResponse = await $`yarn version --patch`
          console.log(`${chalk.green(versionUpdateResponse.stdout)}`)
          
          const gitPushResponse = await $`git push`
          console.log(gitPushResponse.stdout)
        }
      }
  } else {
    console.log(`Since last release there have not been changes to ${dirtyPath}`)
    console.log(`The application will update as a patch from version ${chalk.green(currentApplicationVersion)}`)

    // Only run mutable actions on the CI. Comment out for local testing but be carful of `git push`
    if (inCI) {
      await $`yarn config set version-git-message "chore: version minor update v%s"`
      const versionUpdateResponse = await $`yarn version --patch`
      console.log(`${chalk.green(versionUpdateResponse.stdout)}`)
      
      const gitPushResponse = await $`git push`
      console.log(gitPushResponse.stdout)
    }
  }
} catch (error) {
  console.log(`Exit code: ${error.exitCode}`);
  console.log(`Error: ${error.stderr}`);
}
