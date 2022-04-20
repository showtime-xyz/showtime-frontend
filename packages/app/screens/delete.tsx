import { useEffect, useMemo } from "react";
import { Platform } from "react-native";

import { Delete } from "app/components/delete";
import { mixpanel } from "app/lib/mixpanel";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal, ModalSheet } from "design-system";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

const DeleteModal = () => {
  useHideHeader();
  const router = useRouter();
  const [nftId] = useParam("id");

  useEffect(() => {
    mixpanel.track("Delete nft view");
  }, []);

  const snapPoints = useMemo(() => ["90%"], []);

  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;

  return (
    <ModalComponent
      title="Delete"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[90vh]"
      bodyTW="bg-white dark:bg-black"
    >
      <Delete nftId={nftId} />
    </ModalComponent>
  );
};

export const DeleteScreen = withModalScreen(
  DeleteModal,
  "/nft/[id]/delete",
  "deleteModal"
);
