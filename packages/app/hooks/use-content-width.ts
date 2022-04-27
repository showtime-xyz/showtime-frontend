import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { MAX_CONTENT_WIDTH } from "app/constants/layout";

export default function useContentWidth(offset = 0) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(
    () => (width < MAX_CONTENT_WIDTH ? width : MAX_CONTENT_WIDTH - offset),
    [width]
  );
  return contentWidth;
}
