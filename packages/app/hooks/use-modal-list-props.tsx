import { Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export const useModalListProps = () => {
  return {
    useWindowScroll: false,
    ...Platform.select({
      android: { renderScrollComponent: BottomSheetScrollView as any },
      default: {},
    }),
  };
};
