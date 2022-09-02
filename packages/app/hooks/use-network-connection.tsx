import { useEffect } from "react";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { useIsForeground } from "./use-is-foreground";
import { useIsOnline } from "./use-is-online";

export const useNetWorkConnection = () => {
  const { bottom } = useSafeAreaInsets();
  const isForeground = useIsForeground();
  const snackbar = useSnackbar();
  const { isOnline } = useIsOnline();

  useEffect(() => {
    const getNetwork = async () => {
      if (isOnline) return;
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
