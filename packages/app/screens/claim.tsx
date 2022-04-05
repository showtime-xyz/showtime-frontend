import { Suspense, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Claim } from "app/components/claim";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

type Query = {
  nftId: number;
};

const { useParam } = createParam<Query>();

const snapPoints = ["90%"];

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

export function ClaimScreen() {
  const wasClosedByUserAction = useRef<boolean | undefined>(undefined);

  //#region hooks
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();
  // @ts-ignore
  const [nftId, _] = useParam("nftId");
  //#endregion

  //#region callbacks
  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.back();
  }, [router]);
  const handleOnClose = useCallback(() => {
    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.back();
    }
  }, [router]);
  //#endregion

  const ClaimModal = Platform.OS === "android" ? ModalSheet : Modal;

  return (
    <ClaimModal
      title="Claim"
      snapPoints={snapPoints}
      height="h-[90vh]"
      close={handleClose}
      onClose={handleOnClose}
      keyboardVerticalOffset={topSafeArea + modalPresentationHeight}
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
      scrollable={false}
    >
      <Suspense fallback={null}>
        <Claim nftId={nftId} />
      </Suspense>
    </ClaimModal>
  );
}
