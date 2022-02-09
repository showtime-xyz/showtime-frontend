#!/usr/bin/env bash

# This script wraps the xcodebuild command and exits with non-zero if the build fails. 
#
# This ensures that CI fails on the correct step instead of attempting to run Detox tests without a
# build.

set -eu

iosName=$1
# Debug or Release
configuration=$2
# YES or NO
UseModernBuildSystem=${3:-"NO"}

xcodebuild \
  -workspace ios/$iosName.xcworkspace \
  -scheme $iosName \
  -configuration "$configuration" \
  -sdk iphonesimulator \
  -derivedDataPath "ios/build" \
  -UseModernBuildSystem="$UseModernBuildSystem" 2>&1 | npx excpretty ./

if [ "${PIPESTATUS[0]}" -ne "0" ]; then
  echo 'Build Failed'
  set +e
  exit 1
fi

echo 'Build Succeeded'