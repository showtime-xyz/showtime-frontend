import { Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { MOBILE_WEB_BOTTOM_NAV_HEIGHT } from "app/constants/layout";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";

import { breakpoints } from "design-system/theme";

export const usePlatformBottomHeight = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nativeBottomTabBarHeight = useBottomTabBarHeight();
  const isMdWidth = width >= breakpoints["md"];
  const webBottomTabBarHeight = isMdWidth
    ? insets.bottom
    : insets.bottom + MOBILE_WEB_BOTTOM_NAV_HEIGHT;

  return Platform.OS === "web"
    ? webBottomTabBarHeight
    : nativeBottomTabBarHeight;
};
