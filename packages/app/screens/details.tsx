import { useMemo } from "react";
import { Platform } from "react-native";

import { Details } from "app/components/details";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const DetailsScreen = () => {
  useHideHeader();

  //#region hooks
  const router = useRouter();
  const [nftId, setNftId] = useParam("id");
  //#endregion

  //#region variables
  const snapPoints = useMemo(() => ["90%"], []);
  const DetailsModal = Platform.OS === "android" ? ModalSheet : Modal;
  //#endregion

  return (
    <DetailsModal
      title="Details"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[80vh]"
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
    >
      <Details nftId={Number(nftId)} />
    </DetailsModal>
  );
};

export { DetailsScreen };
