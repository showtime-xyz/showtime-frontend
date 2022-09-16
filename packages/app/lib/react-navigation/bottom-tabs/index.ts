import { useContext } from "react";

import {
  useBottomTabBarHeight as useRNBottomTabBarHeight,
  BottomTabBarHeightContext,
  BottomTabBarHeightCallbackContext,
} from "@react-navigation/bottom-tabs";

const useBottomTabBarHeight = () => {
  const nativeBottomTabBarHeight = useContext(BottomTabBarHeightContext)
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useRNBottomTabBarHeight()
    : 0;

  return nativeBottomTabBarHeight;
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
