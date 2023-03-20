#!/bin/bash

# Run the build command and capture its output
BUILD_OUTPUT=$(STAGE=development eas build --profile simulator --platform ios)

# Check for successful build
if echo "$BUILD_OUTPUT" | grep -q "✔ Build finished"; then
  # Extract the URL of the iOS app
  DOWNLOAD_URL=$(echo "$BUILD_OUTPUT" | grep -Eo 'https://expo\.dev/artifacts/eas/[A-Za-z0-9]+/[A-Za-z0-9]+\.tar\.gz')

  # Download the iOS app
  if [ -n "$DOWNLOAD_URL" ]; then
    echo "Downloading the iOS app from: $DOWNLOAD_URL"
    curl -O "$DOWNLOAD_URL"
  else
    echo "Failed to extract the download URL from the build output."
  fi
else
  echo "The build process failed."
fi