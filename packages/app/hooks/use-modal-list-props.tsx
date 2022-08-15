import { Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";

export const useModalListProps = () => {
  const router = useRouter();
  return {
    // Todo: react-virtuoso‘s list height does not adapt when in Modal, so set min-height to fix it first. and dig reason later.
    style:
      Platform.OS === "web" && (router.query as any)?.commentsModal
        ? tw.style("min-h-50vh")
        : null,
    useWindowScroll: false,
    ...Platform.select({
      android: { renderScrollComponent: BottomSheetScrollView as any },
      default: {},
    }),
  };
};
