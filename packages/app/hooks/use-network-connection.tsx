import { useEffect } from "react";

import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import { useIsForeground } from "./use-is-foreground";
import { useIsOnline } from "./use-is-online";
import { usePlatformBottomHeight } from "./use-platform-bottom-height";

export const useNetWorkConnection = () => {
  const bottom = usePlatformBottomHeight();
  const isForeground = useIsForeground();
  const snackbar = useSnackbar();
  const { isOnline } = useIsOnline();

  useEffect(() => {
    const getNetwork = async () => {
      if (isOnline) return;
      snackbar?.show({
        text: `No internet connection`,
        bottom: bottom,
        hideAfter: 3000,
      });
    };
    getNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom, isForeground]);
};
