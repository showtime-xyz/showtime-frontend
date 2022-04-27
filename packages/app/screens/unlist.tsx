import { withColorScheme } from "app/components/memo-with-theme";
import { Unlist } from "app/components/unlist";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { withModalScreen } from "app/navigation/with-modal-screen";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const UnlistModal = withColorScheme(() => {
  useHideHeader();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  return <Unlist nft={data?.data?.item} />;
});

export const UnlistScreen = withModalScreen(
  UnlistModal,
  "/nft/[chainName]/[contractAddress]/[tokenId]/unlist",
  "unlistModal"
);
