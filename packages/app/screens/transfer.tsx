import { Transfer } from "app/components/transfer";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const TransferModal = () => {
  useTrackPageViewed({ name: "Transfer" });
  useHideHeader();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  const { data: nft } = useNFTDetails(data?.data?.item?.nft_id);

  return <Transfer nft={nft} />;
};

export const TransferScreen = withModalScreen(
  TransferModal,
  "Transfer",
  "/nft/[chainName]/[contractAddress]/[tokenId]/transfer",
  "transferModal"
);
