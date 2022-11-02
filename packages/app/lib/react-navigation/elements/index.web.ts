import { useWindowDimensions } from "react-native";

import {
  WEB_HEADER_HEIGHT,
  MOBILE_WEB_HEADER_HEIGHT,
} from "app/constants/layout";

import { breakpoints } from "design-system/theme";

const useHeaderHeight = () => {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  return isMdWidth ? WEB_HEADER_HEIGHT : MOBILE_WEB_HEADER_HEIGHT;
};

export { useHeaderHeight };
