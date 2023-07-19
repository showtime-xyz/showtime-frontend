import { useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import {
  WEB_HEADER_HEIGHT,
  MOBILE_WEB_HEADER_HEIGHT,
} from "app/constants/layout";
import { HIDE_MOBILE_WEB_HEADER_SCREENS } from "app/lib/constants";

import { breakpoints } from "design-system/theme";

const useHeaderHeight = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  if (isMdWidth) {
    return WEB_HEADER_HEIGHT;
  }
  if (HIDE_MOBILE_WEB_HEADER_SCREENS.includes(router.pathname)) {
    return 0;
  }
  return MOBILE_WEB_HEADER_HEIGHT;
};

export { useHeaderHeight };
