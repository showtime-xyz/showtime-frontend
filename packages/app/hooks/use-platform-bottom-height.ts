import { Platform, useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import { HIDE_LINK_FOOTER_ROUTER_LIST } from "app/lib/constants";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";

import { breakpoints } from "design-system/theme";

import { useUser } from "./use-user";

export const usePlatformBottomHeight = () => {
  const { isAuthenticated } = useUser();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nativeBottomTabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  if (!isAuthenticated) return 0;

  if (Platform.OS === "web") {
    const mobileWebBottomHeight = HIDE_LINK_FOOTER_ROUTER_LIST.includes(
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

  return nativeBottomTabBarHeight;
};
