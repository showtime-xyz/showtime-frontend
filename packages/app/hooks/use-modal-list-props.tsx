import { Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { tw } from "@showtime-xyz/universal.tailwind";

export const useModalListProps = () => {
  return {
    // Todo: react-virtuoso‘s list height does not adapt when in Modal, so set min-height to fix it first. and dig reason later.
    style: tw.style("native:flex-1 min-h-50vh"),
    useWindowScroll: false,
    ...Platform.select({
      android: { renderScrollComponent: BottomSheetScrollView as any },
      default: {},
    }),
  };
};
