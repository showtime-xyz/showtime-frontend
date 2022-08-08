import { ViewStyle } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

type ViewOption = {
  mode?: "padding" | "margin";
  offset?: number;
};
export const useModalScreenViewStyle = (options?: ViewOption): ViewStyle => {
  const mode = options?.mode ?? "padding";
  const offset = options?.offset ?? 0;

  const router = useRouter();
  const isModalScreen = router.pathname !== "/";
  const headerHeight = useHeaderHeight();
  const bottomHeight = useBottomTabBarHeight();
  const top = isModalScreen ? 0 : headerHeight + 16 + offset;
  const bottom = isModalScreen ? 0 : bottomHeight + offset;
  if (mode === "margin") {
    return {
      marginTop: top,
      marginBottom: bottom,
    };
  }
  return {
    paddingTop: top,
    paddingBottom: bottom,
  };
};
