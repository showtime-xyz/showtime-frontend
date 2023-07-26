import { useEffect, useRef } from "react";

import { toast } from "design-system/toast";

// Custom hook for checking if the app is currently in the foreground
import { useIsForeground } from "./use-is-foreground";
// Custom hook for checking if the device is currently online
import { useIsOnline } from "./use-is-online";

export const useNetWorkConnection = () => {
  const connectionWasLost = useRef(false);

  // Check if app is in foreground
  const isForeground = useIsForeground();
  // Check if device is online
  const { isOnline } = useIsOnline();

  useEffect(() => {
    const getNetwork = async () => {
      // Show error message if app is in foreground and device is offline
      if (isForeground && !isOnline && !connectionWasLost.current) {
        toast.error("No network connection");
        connectionWasLost.current = true;
        return;
      }

      // Show success message if app is in foreground and device is back online
      if (isForeground && isOnline && connectionWasLost.current) {
        toast.success("Network connected");
        connectionWasLost.current = false;
      }
    };

    // Call the getNetwork function
    getNetwork();
  }, [isForeground, isOnline]); // Rerun effect if isForeground or isOnline changes
};
