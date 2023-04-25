import { useContext } from "react";

import {
  BottomTabBarHeightContext,
  BottomTabBarHeightCallbackContext,
} from "@react-navigation/bottom-tabs";

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

export { BottomTabBarHeightContext, useBottomTabBarHeightCallback };
