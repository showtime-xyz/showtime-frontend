import { Platform } from "react-native";

export const useModalListProps = (height?: number | string | null) => {
  return {
    /**
     * Notes: react-virtuoso doesn’t support auto-height in non-window-scroll mode, so we need to calculate the list height manually.
     */
    style: Platform.select({
      web: height ? { height } : null,
      default: null,
    }),
    useWindowScroll: false,
  };
};
