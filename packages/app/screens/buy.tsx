import { Buy } from "app/components/buy";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { createParam } from "app/navigation/use-param";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

import { useNFTDetailByTokenId } from "../hooks/use-nft-detail-by-token-id";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const BuyModal = () => {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  const { data: nft } = useNFTDetails(data?.data?.item?.nft_id);

  return <Buy nft={nft} />;
};

export const BuyScreen = withModalScreen(
  BuyModal,
  "Buy",
  "/nft/[chainName]/[contractAddress]/[tokenId]/buy",
  "buyModal"
);
