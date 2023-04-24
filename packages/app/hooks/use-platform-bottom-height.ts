import { Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";

import { breakpoints } from "design-system/theme";

export const usePlatformBottomHeight = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nativeBottomTabBarHeight = useBottomTabBarHeight();

  if (Platform.OS === "web") {
    const mobileWebBottomHeight = insets.bottom + MOBILE_WEB_TABS_HEIGHT;

    const isMdWidth = width >= breakpoints["md"];
    const webBottomTabBarHeight = isMdWidth
      ? insets.bottom
      : mobileWebBottomHeight;
    return webBottomTabBarHeight;
  }

  return nativeBottomTabBarHeight;
};
