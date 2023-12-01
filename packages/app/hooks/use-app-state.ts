import React from "react";
import { AppState, AppStateStatus } from "react-native";

interface IUseAppState {
  onChange?: (state: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}

export function useAppState(settings: IUseAppState) {
  const { onChange, onForeground, onBackground } = settings || {};

  const appState = React.useRef<AppStateStatus>(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState<AppStateStatus>(
    appState.current
  );

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && appState.current !== "active") {
        if (onForeground) {
          onForeground();
        }
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        if (onBackground) {
          onBackground();
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      if (onChange) {
        onChange(nextAppState);
      }
    };
    const sub = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      sub.remove();
    };
  }, [onBackground, onChange, onForeground]);
  return { appStateVisible };
}
