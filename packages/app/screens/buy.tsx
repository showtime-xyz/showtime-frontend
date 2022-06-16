import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Buy } from "app/components/buy";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const BuyModal = () => {
  useTrackPageViewed({ name: "Buy" });
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

export const BuyScreen = withModalScreen(BuyModal, {
  title: "Buy",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/buy",
  matchingQueryParam: "buyModal",
  disableBackdropPress: true,
});
