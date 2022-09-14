import { useContext } from "react";

import {
  useBottomTabBarHeight as useRNBottomTabBarHeight,
  BottomTabBarHeightContext,
} from "@react-navigation/bottom-tabs";

const useBottomTabBarHeight = () => {
  const nativeBottomTabBarHeight = useContext(BottomTabBarHeightContext)
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useRNBottomTabBarHeight()
    : 0;

  return nativeBottomTabBarHeight;
};

export { BottomTabBarHeightContext, useBottomTabBarHeight };
