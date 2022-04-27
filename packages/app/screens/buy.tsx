import { useMemo } from "react";
import { Platform } from "react-native";

import { useNFTDetails } from "app/hooks/use-nft-details";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal, ModalSheet, Text } from "design-system";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const BuyModal = () => {
  const [nftId] = useParam("id");

  const router = useRouter();
  const { data: nft } = useNFTDetails(Number(nftId));
  //#endregion

  //#region variables
  const snapPoints = useMemo(() => ["90%"], []);
  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;
  //#endregion

  return (
    <>
      <ModalComponent
        title="Buy"
        close={router.pop}
        snapPoints={snapPoints}
        bodyTW="bg-white dark:bg-black"
        height="h-[90vh]"
        bodyContentTW="p-0"
      >
        <Text>hi</Text>
      </ModalComponent>
    </>
  );
};

export const BuyScreen = withModalScreen(BuyModal, "/nft/[id]/buy", "buyModal");
