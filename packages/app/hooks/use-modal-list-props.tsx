import { useMemo } from "react";
import { Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { useRouter } from "@showtime-xyz/universal.router";

const ModalListScreenQueryParamList = [
  "followersModal",
  "followingModal",
  "commentsModal",
  "claimersModal",
];

export const useModalListProps = () => {
  const router = useRouter();
  // Todo: hacks code, will remove it once the react-virtuoso‘s list auto height in modal issue fix.
  const isHasModalParam = useMemo(() => {
    const index = ModalListScreenQueryParamList.findIndex((key) =>
      Object.prototype.hasOwnProperty.call(router.query, key)
    );
    return index > -1;
  }, [router.query]);

  return {
    // Todo: react-virtuoso‘s list height does not adapt when in Modal, so set min-height to fix it first. and dig reason later.
    style: Platform.select({
      web: isHasModalParam ? { minHeight: "50vh" } : null,
      default: null,
    }),
    useWindowScroll: false,
    ...Platform.select({
      android: { renderScrollComponent: BottomSheetScrollView as any },
      default: {},
    }),
  };
};
