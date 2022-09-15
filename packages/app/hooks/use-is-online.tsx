import { useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    NetInfo.fetch().then((s) => {
      if (typeof s.isInternetReachable === "boolean") {
        setIsOnline(s.isInternetReachable);
      }
    });

    const unsubscribe = NetInfo.addEventListener((s) => {
      if (typeof s.isInternetReachable === "boolean") {
        setIsOnline(s.isInternetReachable);
      }
    });

    return unsubscribe;
  }, []);
  return {
    isOnline,
  };
};
