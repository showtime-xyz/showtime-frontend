import { useMemo } from "react";
import { Platform } from "react-native";

import { Delete } from "app/components/delete";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal, ModalSheet } from "design-system";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const DeleteModal = () => {
  useHideHeader();
  const router = useRouter();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

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
      <Delete nft={data?.data?.item} />
    </ModalComponent>
  );
};

export const DeleteScreen = withModalScreen(
  DeleteModal,
  "/nft/[chainName]/[contractAddress]/[tokenId]/delete",
  "deleteModal"
);
