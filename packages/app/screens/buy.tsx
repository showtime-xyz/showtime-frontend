
import { Buy } from "app/components/buy";
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
  const { data: nft } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  console.log("djdjdjdj ", nft?.data)

  return (

        <Buy nft={nft?.data.item} />
  );
};

export const BuyScreen = withModalScreen(
  BuyModal,
  "Buy",
  "/nft/[chainName]/[contractAddress]/[tokenId]/buy",
  "buyModal"
);


