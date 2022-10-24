import { useContext } from "react";

import {
  BottomTabBarHeightContext,
  BottomTabBarHeightCallbackContext,
} from "@react-navigation/bottom-tabs";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { useUser } from "app/hooks/use-user";
import { BOTTOM_TABBAR_BASE_HEIGHT } from "app/lib/constants";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

const useBottomTabBarHeight = () => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { isTabBarHidden } = useNavigationElements();
  const { isAuthenticated } = useUser();

  if (isTabBarHidden || !isAuthenticated) {
    return 0;
  }
  return safeAreaBottom + BOTTOM_TABBAR_BASE_HEIGHT ?? 0;
};
const useBottomTabBarHeightCallback = () => {
  const nativeBottomTabBarHeightCallback = useContext(
    BottomTabBarHeightCallbackContext
  );
  if (nativeBottomTabBarHeightCallback === undefined) {
    throw new Error(
      "Couldn't find the bottom tab bar height callback. Are you inside a screen in Bottom Tab Navigator?"
    );
  }

  return nativeBottomTabBarHeightCallback;
};

export {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
  useBottomTabBarHeightCallback,
};
