// From https://forums.expo.dev/t/constants-installationid-how-to-implement-it-on-your-own/50003/15
import { Platform } from "react-native";

import * as Application from "expo-application";
import { v4 as uuidv4 } from "uuid";
import { v5 as uuidv5 } from "uuid";

const UUID_NAMESPACE = "29cc8a0d-747c-5f85-9ff9-f2f16636d963";

async function getInstallationId() {
  let installationId: string | null = null;

  if (["android", "ios"].includes(Platform.OS)) {
    let identifierForVendor: string | null = null;

    if (Platform.OS === "android") {
      identifierForVendor = Application.androidId;
    } else {
      identifierForVendor = await Application.getIosIdForVendorAsync();
    }

    const bundleIdentifier = Application.applicationId;

    if (identifierForVendor) {
      installationId = uuidv5(
        `${bundleIdentifier}-${identifierForVendor}`,
        UUID_NAMESPACE
      );
    } else {
      const installationTime = await Application.getInstallationTimeAsync();
      installationId = uuidv5(
        `${bundleIdentifier}-${installationTime.getTime()}`,
        UUID_NAMESPACE
      );
    }
  } else {
    // Web. random (uuid v4)
    installationId = uuidv4();
  }

  return installationId;
}

export { getInstallationId };
