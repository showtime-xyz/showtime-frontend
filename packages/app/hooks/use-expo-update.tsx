import { useEffect, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { differenceInMinutes } from "date-fns";
import * as Updates from "expo-updates";

import { captureException } from "app/lib/sentry";

import { useIsForeground } from "./use-is-foreground";

export function useExpoUpdate() {
  const isForeground = useIsForeground();
  const appBackgrounded = useRef<Date | null>(null);
  const lastUpdateCheck = useRef<Date | null>(null);

  const checkUpdate = useCallback(async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) {
        return;
      }

      const result = await Updates.fetchUpdateAsync();

      if (!result.isNew) {
        return;
      }

      await Updates.reloadAsync();
    } catch (error) {
      captureException(error);
    }
  }, []);

  useEffect(() => {
    // dont run on web or dev mode
    if (__DEV__ || Platform.OS === "web") return;

    // this fires when the app is backgrounded or in inactive state (app switcher)
    // will be skipped on first run
    if (!isForeground) {
      appBackgrounded.current = new Date();
      return;
    }

    // check if its the first time running, so its cold start
    if (!lastUpdateCheck.current) {
      checkUpdate();
    } else if (
      // check if its been 30 minutes since the last check and the app was backgrounded
      appBackgrounded.current &&
      differenceInMinutes(new Date(), appBackgrounded.current) > 15
    ) {
      checkUpdate();
    }

    lastUpdateCheck.current = new Date();
  }, [checkUpdate, isForeground]);
}
