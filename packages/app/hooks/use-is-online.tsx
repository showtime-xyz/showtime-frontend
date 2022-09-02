import { useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";

export const useIsOnline = () => {
  const [isOnline, setIsOnlie] = useState(true);
  useEffect(() => {
    NetInfo.fetch().then((s) => {
      setIsOnlie(!!s.isConnected && !!s.isInternetReachable);
    });

    const unsubscribe = NetInfo.addEventListener((s) => {
      setIsOnlie(!!s.isConnected && !!s.isInternetReachable);
    });

    return unsubscribe;
  }, []);
  return {
    isOnline,
  };
};
