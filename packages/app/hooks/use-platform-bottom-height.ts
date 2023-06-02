import { Platform, useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import {
  BOTTOM_TABBAR_BASE_HEIGHT,
  HIDE_MOBILE_WEB_FOOTER_SCREENS,
} from "app/lib/constants";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { breakpoints } from "design-system/theme";

export const usePlatformBottomHeight = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { isTabBarHidden } = useNavigationElements();
  const router = useRouter();
  if (isTabBarHidden) {
    return 0;
  }
  if (Platform.OS === "web") {
    const mobileWebBottomHeight = HIDE_MOBILE_WEB_FOOTER_SCREENS.includes(
      router.pathname
    )
      ? 0
      : insets.bottom + MOBILE_WEB_TABS_HEIGHT;
    const isMdWidth = width >= breakpoints["md"];
    const webBottomTabBarHeight = isMdWidth
      ? insets.bottom
      : mobileWebBottomHeight;
    return webBottomTabBarHeight;
  }
  if (router.pathname !== "/") {
    return Math.max(safeAreaBottom, 8);
  }
  return safeAreaBottom + BOTTOM_TABBAR_BASE_HEIGHT;
};
