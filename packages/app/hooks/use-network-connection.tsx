import { useEffect } from "react";

import { toast } from "design-system/toast";

import { useIsForeground } from "./use-is-foreground";
import { useIsOnline } from "./use-is-online";

export const useNetWorkConnection = () => {
  const isForeground = useIsForeground();
  const { isOnline } = useIsOnline();

  useEffect(() => {
    const getNetwork = async () => {
      if (isOnline) return;
      toast.error("No internet connection");
    };
    getNetwork();
  }, [isForeground, isOnline]);
};
