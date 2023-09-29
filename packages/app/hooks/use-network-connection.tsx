import { useEffect, useRef } from "react";

import { toast } from "design-system/toast";

// Custom hook for checking if the app is currently in the foreground
import { useIsForeground } from "./use-is-foreground";
// Custom hook for checking if the device is currently online
import { useIsOnline } from "./use-is-online";

export const useNetWorkConnection = () => {
  const connectionWasLost = useRef(false);
  const ignoreNextNetworkChange = useRef(false);
  const wasBackgrounded = useRef(false);

  // Check if app is in foreground
  const isForeground = useIsForeground();
  // Check if device is online
  const { isOnline } = useIsOnline();

  useEffect(() => {
    if (!isForeground) {
      wasBackgrounded.current = true;
      ignoreNextNetworkChange.current = true;
      setTimeout(() => {
        ignoreNextNetworkChange.current = false;
      }, 1000); // Ignore for 1 second after coming to foreground
    } else {
      wasBackgrounded.current = false;
    }
  }, [isForeground]);

  useEffect(() => {
    const getNetwork = async () => {
      // If we're set to ignore this network change, just return
      if (ignoreNextNetworkChange.current) {
        return;
      }

      // Show error message if app is in foreground and device is offline
      if (isForeground && !isOnline && !connectionWasLost.current) {
        toast.error("No network connection");
        connectionWasLost.current = true;
      }

      // Show success message if app is in foreground and device is back online
      // But only if the app wasn't backgrounded
      if (
        isForeground &&
        isOnline &&
        connectionWasLost.current &&
        !wasBackgrounded.current
      ) {
        toast.success("Network connected");
        connectionWasLost.current = false;
      }
    };

    // Call the getNetwork function
    getNetwork();
  }, [isForeground, isOnline]); // Rerun effect if isForeground or isOnline changes
};
