import { useMemo } from "react";
import { Platform } from "react-native";

import { Details } from "app/components/details";
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

const DetailsModal = () => {
  useHideHeader();

  //#region hooks
  const router = useRouter();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  //#endregion

  //#region variables
  const snapPoints = useMemo(() => ["90%"], []);
  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;
  //#endregion

  return (
    <ModalComponent
      title="Details"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[80vh]"
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
    >
      <Details nft={data?.data?.item} />
    </ModalComponent>
  );
};

export const DetailsScreen = withModalScreen(
  DetailsModal,
  "/nft/[chainName]/[contractAddress]/[tokenId]/details",
  "detailsModal"
);
