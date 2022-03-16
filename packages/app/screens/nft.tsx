import { Suspense } from "react";
import { Dimensions } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeedItem } from "app/components/swipe-list";
import { createParam } from "app/navigation/use-param";

import { Skeleton, View } from "design-system";
import { useColorScheme } from "design-system/hooks";

import { useNFTDetailByTokenId } from "../hooks/use-nft-detail-by-token-id";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();
const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

function NftScreen() {
  const colorScheme = useColorScheme();

  return (
    <Suspense
      fallback={
        <View tw="items-center">
          <Skeleton
            colorMode={colorScheme}
            height={screenHeight - 300}
            width={screenWidth}
          />
          <View tw="h-2" />
          <Skeleton colorMode={colorScheme} height={300} width={screenWidth} />
        </View>
      }
    >
      <NFTDetail />
    </Suspense>
  );
}

const NFTDetail = () => {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName,
    tokenId,
    contractAddress,
  });
  const headerHeight = useHeaderHeight();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  if (data && data.data.item) {
    return (
      <FeedItem
        itemHeight={screenHeight - headerHeight}
        bottomPadding={safeAreaBottom}
        nft={data.data.item}
      />
    );
  }

  return null;
};
export { NftScreen };
