import { useEffect, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { differenceInMinutes } from "date-fns";
import * as Updates from "expo-updates";

import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { captureException } from "app/lib/sentry";

import { useIsForeground } from "./use-is-foreground";

export function useExpoUpdate() {
  const bottom = usePlatformBottomHeight();
  const isForeground = useIsForeground();
  const snackbar = useSnackbar();
  const appBackgrounded = useRef<Date | null>(null);
  const lastUpdateCheck = useRef<Date | null>(null);

  const checkUpdate = useCallback(
    async (isAutoUpdate = false) => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (!update.isAvailable) {
          return;
        }

        const result = await Updates.fetchUpdateAsync();

        if (!result.isNew) {
          return;
        }

        if (isAutoUpdate) {
          await Updates.reloadAsync();
        } else {
          snackbar?.show({
            text: "New update available 🎉",
            bottom,
            preset: "explore",
            action: {
              text: "Reload",
              onPress: Updates.reloadAsync,
            },
            disableGestureToClose: true,
            hideAfter: 30000, // 30 seconds
          });
        }
      } catch (error) {
        captureException(error);
      }
    },
    // just use snackbar to prompt once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bottom]
  );

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
      checkUpdate(true);
    } else if (
      // check if its been 30 minutes since the last check and the app was backgrounded
      appBackgrounded.current &&
      differenceInMinutes(new Date(), appBackgrounded.current) > 30
    ) {
      checkUpdate(true);
    }

    lastUpdateCheck.current = new Date();
  }, [checkUpdate, isForeground]);
}
