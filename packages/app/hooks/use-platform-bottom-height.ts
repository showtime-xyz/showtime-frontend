import { Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";

import { breakpoints } from "design-system/theme";

import { useUser } from "./use-user";

export const usePlatformBottomHeight = () => {
  const { isAuthenticated } = useUser();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nativeBottomTabBarHeight = useBottomTabBarHeight();

  if (!isAuthenticated) return 0;

  if (Platform.OS === "web") {
    const isMdWidth = width >= breakpoints["md"];
    const webBottomTabBarHeight = isMdWidth
      ? insets.bottom
      : insets.bottom + MOBILE_WEB_TABS_HEIGHT;
    return webBottomTabBarHeight;
  }

  return nativeBottomTabBarHeight;
};
