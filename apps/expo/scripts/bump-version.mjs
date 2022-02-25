#!/usr/bin/env zx
import "zx/globals";
const applicationPackage = require('../../../package.json')

// TODO: Implement flags to force a patch, minor or major

try {
  $.verbose = false
  const inCI = process.env.CI;
  const dirtyPath = "apps/expo/package.json";
  const currentApplicationVersion = applicationPackage.version

  // As a monorepo the version must be bumped from the root directory not the working project.
  const startingWorkingDirectory = await $`pwd`
  cd('../..')
  const currentWorkingDirectory = await $`pwd`

  console.log(`The starting working directory is ${chalk.blue(startingWorkingDirectory)}`)
  console.log(`The current working directory is ${chalk.blue(currentWorkingDirectory)}`)

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
  const fileNameDiffResponse = await $`git diff ${currentCommitHeadId} ${lastReleaseCommitId} --name-only`
  const fileNameDiff = fileNameDiffResponse.stdout.split("\n");
  const hasPossiblePackageChanges = Boolean(fileNameDiff.find((fileName) => fileName === dirtyPath))

  // if (hasPossiblePackageChanges) {
    if (false) {
      console.log(`Since last release there have ${chalk.green("been")} changes to ${chalk.green(dirtyPath)}`)
    // possible major or can still be minor
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
