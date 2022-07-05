import { useEffect } from "react";
import { Platform } from "react-native";

import { differenceInSeconds, differenceInDays } from "date-fns";
import * as Updates from "expo-updates";
import { MMKV } from "react-native-mmkv";

import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { useIsForeground } from "app/hooks/use-is-foreground";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

/**
 * store key
 */
const store = new MMKV();
const BACKGROUND_START_TIME_KEY = "backgroundStartTime";
const LAST_SHOW_UPDATE_KEY = "lastShowUpdateTime";

/**
 * update constant
 */
const CHECK_UPDATE_FREQUENCY = 1; // days
const SWITCH_TO_FOREGROUND_INTERVAL = 300; // seconds

export function useExpoUpdate() {
  const bottom = usePlatformBottomHeight();
  const isForeground = useIsForeground();
  const snackbar = useSnackbar();

  useEffect(() => {
    const now = new Date();
    const checkUpdate = async (isAutomatic = false) => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          store.set(LAST_SHOW_UPDATE_KEY, now.toISOString());
          if (isAutomatic) {
            Updates.reloadAsync();
          } else {
            snackbar?.show({
              text: "New update available 🎉",
              bottom: bottom + 64,
              action: {
                text: "Reload",
                onPress: () => Updates.reloadAsync(),
              },
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (isForeground) {
      if (__DEV__) return;
      if (Platform.OS !== "ios") return;

      const lastUpdateTime = store.getString(LAST_SHOW_UPDATE_KEY);
      const diffDays = lastUpdateTime
        ? differenceInDays(now, Date.parse(lastUpdateTime))
        : 0;

      // check update frequency, avoid prompting for updates multiple times a day.
      if (diffDays < CHECK_UPDATE_FREQUENCY) return;

      const startTime = store.getString(BACKGROUND_START_TIME_KEY);
      const diffSeconds = startTime
        ? differenceInSeconds(now, Date.parse(startTime))
        : 0;

      // only display update when after 5 minutes in background.
      if (diffSeconds < SWITCH_TO_FOREGROUND_INTERVAL) return;
      // if between 3am and 5am, will auto-update.
      const currentHours = now.getHours();
      checkUpdate(currentHours > 3 && currentHours < 5);
    } else {
      store.set(BACKGROUND_START_TIME_KEY, now.toISOString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom, isForeground]);
}
