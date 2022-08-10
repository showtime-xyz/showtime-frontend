import { Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { tw } from "@showtime-xyz/universal.tailwind";

export const useModalListProps = () => {
  return {
    style: tw.style("web:h-screen native:flex-1 native:min-h-72vh"),
    useWindowScroll: false,
    ...Platform.select({
      android: { renderScrollComponent: BottomSheetScrollView as any },
      default: {},
    }),
  };
};
