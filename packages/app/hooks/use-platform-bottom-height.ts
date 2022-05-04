import { useContext } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { breakpoints } from "design-system/theme";

import {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
} from "../lib/react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "../lib/safe-area/index.web";

export const usePlatformBottomHeight = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const nativeBottomTabBarHeight = useContext(BottomTabBarHeightContext)
    ? useBottomTabBarHeight()
    : insets.bottom;
  const webBottomTabBarHeight = isMdWidth ? insets.bottom : insets.bottom + 64;
  return Platform.OS === "web"
    ? webBottomTabBarHeight
    : nativeBottomTabBarHeight;
};
