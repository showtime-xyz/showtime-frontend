import React from "react";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { createParam } from "app/navigation/use-param";
import { formatAddressShort } from "app/utilities";

import { Button, Image, Spinner, Text, View } from "design-system";
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

const { useParam } = createParam<{ collectionAddress: string }>();

const CollectionModal = () => {
  const [collectionAddress] = useParam("collectionAddress");
  const { data, loading, error, mutate } =
    useCreatorCollectionDetail(collectionAddress);
  // const { web3 } = useWeb3();
  const { state, claimNFT } = useClaimNFT();

  const { userAddress } = useCurrentUserAddress();
  // const [ensName, setEnsName] = React.useState<string | null>(null);
  // React.useEffect(() => {
  //   web3
  //     ?.getSigner()
  //     .getAddress()
  //     .then((addr) => {
  //       web3?.lookupAddress(addr).then((name) => {
  //         setEnsName(name);
  //       });
  //     });
  // }, [web3]);

  if (error) {
    return (
      <Button onPress={mutate}>Something went wrong. Please Try again</Button>
    );
  }

  if (loading) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (state.status === "success") {
    return (
      <View tw="flex-1 items-center justify-center">
        <Text tw="text-4xl">🎉</Text>
        <View tw="mt-8">
          <Text tw="font-space-bold my-8 text-center text-lg text-black dark:text-white">
            Your NFT has been claimed!
          </Text>
          <View tw="h-4" />
          <PolygonScanButton transactionHash={state.transactionHash} />
        </View>
      </View>
    );
  }

  if (data) {
    return (
      <View tw="flex-1 items-start p-4">
        <View tw="flex-row">
          <Image
            tw="h-20 w-20 rounded-lg"
            source={{
              uri:
                "https://ipfs.io/ipfs/" + data.image_url.replace("ipfs://", ""),
            }}
          />
          <View tw="ml-4">
            <Text tw="text-xl font-bold text-black dark:text-white">
              {data.name}
            </Text>
          </View>
        </View>
        <View tw="mt-4 w-full">
          <View tw="mb-4">
            <Text tw="text-gray-900 dark:text-gray-100">
              {data.description}
            </Text>
          </View>
          <View tw="flex-row justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <View>
              <Text tw="pb-2 text-sm font-semibold text-gray-600 dark:text-gray-200">
                Wallet
              </Text>
              <Text tw="text-sm font-bold text-gray-900 dark:text-gray-100">
                {formatAddressShort(userAddress)}
              </Text>
            </View>
            <View>
              <Text tw="pb-2 text-sm font-semibold text-gray-600 dark:text-gray-200">
                Claim amount
              </Text>
              <Text tw="text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                1
              </Text>
            </View>
          </View>
          <View tw="mt-4">
            {/* <ClaimButton edition={data} /> */}
            <Button
              disabled={state.status === "loading"}
              tw={state.status === "loading" ? "opacity-45" : ""}
              onPress={() => claimNFT({ minterAddress: data.minter_address })}
            >
              {state.status === "loading"
                ? "Claiming..."
                : state.status === "error"
                ? "Failed. Retry!"
                : "Claim for free"}
            </Button>
            <View tw="mt-4">
              <PolygonScanButton transactionHash={state.transactionHash} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

export const CollectionScreen = withModalScreen(CollectionModal, {
  title: "Claim",
  matchingPathname: "/collection/[collectionAddress]",
  matchingQueryParam: "collectionModal",
});
