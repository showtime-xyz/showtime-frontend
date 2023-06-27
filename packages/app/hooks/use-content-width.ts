import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import {
  MAX_CONTENT_WIDTH,
  DESKTOP_LEFT_MENU_WIDTH,
} from "app/constants/layout";

import { breakpoints } from "design-system/theme";

import { useScrollbarSize } from "./use-scrollbar-size";

export enum ContentLayoutOffset {
  HEADER = -240,
  PROFILE_COVER = -160,
}

export function useContentWidth(offset = 0) {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { width: scrollbarWidth } = useScrollbarSize();
  const leftMenuWidth = isMdWidth ? DESKTOP_LEFT_MENU_WIDTH : 0;

  const contentWidth = useMemo(
    () =>
      width < MAX_CONTENT_WIDTH + leftMenuWidth - offset
        ? width - leftMenuWidth + scrollbarWidth
        : MAX_CONTENT_WIDTH - offset,
    [offset, width, leftMenuWidth, scrollbarWidth]
  );
  return contentWidth;
}
