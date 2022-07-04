import { useContext } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
} from "app/lib/react-navigation/bottom-tabs";

import { breakpoints } from "design-system/theme";

export const usePlatformBottomHeight = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const nativeBottomTabBarHeight = useContext(BottomTabBarHeightContext)
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useBottomTabBarHeight()
    : insets.bottom;
  const webBottomTabBarHeight = isMdWidth ? insets.bottom : insets.bottom + 64;

  return Platform.OS === "web"
    ? webBottomTabBarHeight
    : nativeBottomTabBarHeight;
};
