import { Platform } from "react-native";

export const useModalListProps = (height?: number | string | null) => {
  return {
    /**
     * Notes: auto-height doesn't work on the modal list, so we need to calculate the list height manually.
     */
    style: Platform.select({
      web: height ? { height } : null,
      default: null,
    }),
    useWindowScroll: false,
  };
};
