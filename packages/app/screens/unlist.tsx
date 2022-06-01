import { Button } from "@showtime-xyz/universal.button";
import { withModalScreen } from "@showtime-xyz/universal.modal-screen";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { Unlist } from "app/components/unlist";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const UnlistModal = withColorScheme(() => {
  useTrackPageViewed({ name: "Unlist" });
  useHideHeader();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  const {
    data: nft,
    loading,
    refresh,
    error,
  } = useNFTDetails(data?.data?.item?.nft_id);

  if (loading) {
    return (
      <View tw="flex-1 items-center">
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View tw="flex-1 items-center">
        <Text tw="text-gray-900 dark:text-gray-100">Something went wrong</Text>
        <Button tw="mt-4" onPress={refresh}>
          Please try again
        </Button>
      </View>
    );
  }

  return <Unlist nft={nft} />;
});

export const UnlistScreen = withModalScreen(UnlistModal, {
  title: "Unlist",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/unlist",
  matchingQueryParam: "unlistModal",
});
