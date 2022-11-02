import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { MAX_CONTENT_WIDTH } from "app/constants/layout";

export enum ContentLayoutOffset {
  HEADER = -240,
  PROFILE_COVER = -160,
}

export function useContentWidth(offset: ContentLayoutOffset = 0) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(
    () =>
      width < MAX_CONTENT_WIDTH - offset ? width : MAX_CONTENT_WIDTH - offset,
    [offset, width]
  );
  return contentWidth;
}
