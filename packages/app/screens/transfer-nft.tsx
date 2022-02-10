import { useMemo } from "react";
import { Platform } from "react-native";

import { TransferNft } from "app/components/transfer-nft";
import { useRouter } from "app/navigation/use-router";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { Modal, ModalSheet } from "design-system";
import { createParam } from "app/navigation/use-param";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const TransferNftScreen = () => {
  useHideHeader();

  //#region hooks
  const router = useRouter();
  const [nftId, setNftId] = useParam("id");

  //#endregion

  //#region variables
  const snapPoints = useMemo(() => ["90%"], []);
  const TransferModal = Platform.OS === "android" ? ModalSheet : Modal;
  //#endregion

  return (
    <TransferModal
      title="Transfer NFT"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[80vh]"
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
    >
      <TransferNft nftId={nftId} />
    </TransferModal>
  );
};

export { TransferNftScreen };
