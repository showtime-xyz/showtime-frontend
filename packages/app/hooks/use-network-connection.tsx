import { useEffect } from "react";

import * as Network from "expo-network";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { useIsForeground } from "./use-is-foreground";

export const useNetWorkConnection = () => {
  const { bottom } = useSafeAreaInsets();
  const isForeground = useIsForeground();
  const snackbar = useSnackbar();

  useEffect(() => {
    const getNetwork = async () => {
      const { isConnected } = await Network.getNetworkStateAsync();
      if (isConnected) return;
      snackbar?.show({
        text: `No internet connection`,
        bottom: bottom + 64,
        hideAfter: 3000,
      });
    };
    getNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom, isForeground]);
};
