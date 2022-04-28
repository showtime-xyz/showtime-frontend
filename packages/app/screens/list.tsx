import { List } from "app/components/list";
import { withColorScheme } from "app/components/memo-with-theme";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";
import { useNFTDetails } from "app/hooks/use-nft-details";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const ListModal = withColorScheme(() => {
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

  return <List nft={nft} />;
});

export const ListScreen = withModalScreen(
  ListModal,
  "List",
  "/nft/[chainName]/[contractAddress]/[tokenId]/list",
  "listModal"
);
