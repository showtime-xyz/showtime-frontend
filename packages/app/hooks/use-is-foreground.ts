import { useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === "active");
    };
    const listener = AppState.addEventListener("change", onChange);

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [setIsForeground]);

  return isForeground;
};
