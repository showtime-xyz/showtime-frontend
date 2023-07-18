import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import {
  MAX_CONTENT_WIDTH,
  DESKTOP_LEFT_MENU_WIDTH,
} from "app/constants/layout";

import { breakpoints } from "design-system/theme";

export enum ContentLayoutOffset {
  HEADER = -240,
}

export function useContentWidth(offset = 0) {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const leftMenuWidth = isMdWidth ? DESKTOP_LEFT_MENU_WIDTH : 0;

  const contentWidth = useMemo(
    () =>
      width < MAX_CONTENT_WIDTH + leftMenuWidth - offset
        ? width - leftMenuWidth
        : MAX_CONTENT_WIDTH - offset,
    [offset, width, leftMenuWidth]
  );
  return contentWidth;
}
