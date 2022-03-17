import { useMemo } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import { Transfer } from "app/components/transfer";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const TransferScreen = () => {
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
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <Transfer nftId={nftId} />
      </KeyboardAvoidingView>
    </TransferModal>
  );
};

export { TransferScreen };
