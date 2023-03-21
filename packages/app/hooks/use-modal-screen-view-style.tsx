import { Platform, ViewStyle } from "react-native";

import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { useRouter } from "design-system/router";
import { useSafeAreaInsets } from "design-system/safe-area";

type ViewStyleOption = {
  mode?: "padding" | "margin";
  offset?: number;
};
export const useModalScreenViewStyle = (
  options?: ViewStyleOption
): ViewStyle => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const bottomHeight = useBottomTabBarHeight();
  const { bottom: safeInsetBottom } = useSafeAreaInsets();

  const mode = options?.mode ?? "padding";
  const offset = options?.offset ?? 0;
  const isModalScreen = router.pathname !== "/";
  const top = isModalScreen
    ? 0
    : Platform.select({
        ios: headerHeight,
        default: 0,
      }) +
      16 +
      offset;

  const bottom = isModalScreen ? safeInsetBottom : bottomHeight + offset;

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
