import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { List } from "app/components/list";
import { withColorScheme } from "app/components/memo-with-theme";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";

import { Button, Spinner, Text, View } from "design-system";
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

const ListModal = withColorScheme(() => {
  useTrackPageViewed({ name: "List" });
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
    error,
    refresh,
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

  return (
    <BottomSheetModalProvider>
      <List nft={nft} />
    </BottomSheetModalProvider>
  );
});

export const ListScreen = withModalScreen(ListModal, {
  title: "List",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/list",
  matchingQueryParam: "listModal",
});
