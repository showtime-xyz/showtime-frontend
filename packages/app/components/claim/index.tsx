import { useEffect } from "react";
import { Linking } from "react-native";

import { useClaimNFT } from "app/hooks/use-claim-nft";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useRouter } from "app/navigation/use-router";
import { getPolygonScanUrl } from "app/utilities";

import { Button, Media, Text, View } from "design-system";
import { Avatar } from "design-system/avatar";

export const Claim = ({ nftId }: { nftId?: number }) => {
  const nft = useNFTDetails(nftId);

  const { claimNFT, state } = useClaimNFT();
  const router = useRouter();

  const isLoading =
    state.status === "loading" || state.status === "waitingForTransaction";

  useEffect(() => {
    if (state.status === "success") {
      router.pop();
    }
  }, [state.status, router]);

  return (
    <View tw="p-4">
      <View tw="flex-row items-center">
        <View tw="rounded-xl overflow-hidden">
          <Media item={nft.data} tw="w-20 h-20" />
        </View>
        <Text
          //@ts-ignore
          variant="text-lg"
          tw="ml-4"
        >
          {nft.data?.token_name}
        </Text>
      </View>
      <View tw="h-4" />
      <View tw="py-4 flex-row">
        <Avatar url={nft.data?.creator_img_url} size={32} />
        <View tw="justify-around ml-1">
          <Text tw="font-semibold text-gray-600 text-xs">Creator</Text>
          <Text tw="font-semibold text-gray-900 text-xs">
            {nft.data?.creator_username
              ? `@${nft.data?.creator_username}`
              : null}
          </Text>
        </View>
      </View>

      <View tw="mt-4">
        <Button
          tw={`${isLoading ? "opacity-80" : ""}`}
          disabled={isLoading}
          onPress={() => claimNFT(nft.data)}
        >
          {isLoading ? "Processing..." : "Claim 🎁"}
        </Button>
        {state.error ? (
          <Text tw="text-red-600 font-bold text-center mt-4">
            {state.error}
          </Text>
        ) : null}
        {state.transaction ? (
          <Button
            onPress={() => {
              Linking.openURL(getPolygonScanUrl(state.transaction));
            }}
            variant="secondary"
            tw="text-center font-semibold mt-4"
          >
            View on PolygonScan
          </Button>
        ) : null}
      </View>
    </View>
  );
};
