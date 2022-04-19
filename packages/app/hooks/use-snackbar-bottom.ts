import { useContext } from "react";

import {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
} from "../lib/react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "../lib/safe-area/index.web";

export const useSnackbarBottom = () => {
  const insets = useSafeAreaInsets();
  const snackBarHeight = useContext(BottomTabBarHeightContext)
    ? useBottomTabBarHeight()
    : insets.bottom;
  return snackBarHeight;
};
