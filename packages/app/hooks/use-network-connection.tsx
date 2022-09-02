import { useEffect, useCallback } from "react";

import * as Network from "expo-network";

import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { useIsForeground } from "./use-is-foreground";
import { usePlatformBottomHeight } from "./use-platform-bottom-height";

export const useNetWorkConnection = () => {
  const isForeground = useIsForeground();
  const snackbar = useSnackbar();
  const bottom = usePlatformBottomHeight();

  const getNetwork = useCallback(async () => {
    const { isInternetReachable } = await Network.getNetworkStateAsync();
    if (!isInternetReachable) {
      snackbar?.show({
        text: "No internet connection",
        bottom: bottom + 64,
        hideAfter: 3000,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom]);
  useEffect(() => {
    getNetwork();
  }, [getNetwork, isForeground]);
};
