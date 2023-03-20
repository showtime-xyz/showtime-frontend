#!/bin/bash

# Run the build command and capture its output
BUILD_OUTPUT=$(STAGE=development eas build --profile simulator --platform ios)

# Check for successful build
if echo "$BUILD_OUTPUT" | grep -q "✔ Build finished"; then
  # Extract the URL of the iOS app
  DOWNLOAD_URL=$(echo "$BUILD_OUTPUT" | grep -Eo 'https://expo\.dev/artifacts/eas/[A-Za-z0-9]+/[A-Za-z0-9]+\.tar\.gz')
  echo "APP_DIR_PATH=${DOWNLOAD_URL}" >>$GITHUB_ENV
  echo "done!"
fi