import { Platform } from "react-native";

import * as Sentry from "sentry-expo";

export const captureException = (error: any) => {
  if (Platform.OS === "web") {
    Sentry.Browser.captureException(error);
  } else {
    Sentry.Native.captureException(error);
  }
};

export { Sentry };
