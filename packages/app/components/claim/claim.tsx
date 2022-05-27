import React from "react";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useShare } from "app/hooks/use-share";
import { useRouter } from "app/navigation/use-router";
import { IEdition } from "app/types";
import { formatAddressShort } from "app/utilities";

import { Button, Media, Text, View } from "design-system";

import { useNFTDetailByTokenId } from "../../hooks/use-nft-detail-by-token-id";

export const Claim = ({ edition }: { edition: IEdition }) => {
  const { state, claimNFT } = useClaimNFT();
  const share = useShare();
  const router = useRouter();

  const { userAddress } = useCurrentUserAddress();
  const { data: nft } = useNFTDetailByTokenId({
    //@ts-ignore
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition.contract_address,
  });
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

  if (state.status === "success") {
    return (
      <View tw="items-center justify-center p-4">
        <Text style={{ fontSize: 100 }}>🎉</Text>
        <View>
          <View tw="h-8" />
          <Text tw="text-center text-4xl text-black dark:text-white">
            Congrats!
          </Text>
          <View tw="mt-8 mb-10">
            <Text tw="text-center text-2xl text-black dark:text-white">
              Now share it with the world!
            </Text>
          </View>
          <Button
            onPress={() =>
              share({
                url: `https://showtime.xyz/t/${[
                  process.env.NEXT_PUBLIC_CHAIN_ID,
                ]}/${edition?.contract_address}/0`,
              })
            }
          >
            Share with your friends
          </Button>
          <Button variant="tertiary" tw="mt-4" onPress={router.pop}>
            Skip for now
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View tw="flex-1 items-start p-4">
      <View tw="flex-row">
        <Media nft={nft} tw="h-20 w-20 rounded-lg" />
        <View tw="ml-4">
          <Text tw="text-xl font-bold text-black dark:text-white">
            {edition.name}
          </Text>
        </View>
      </View>
      <View tw="mt-4 w-full">
        <View tw="mb-4">
          <Text tw="text-gray-900 dark:text-gray-100">
            {edition.description}
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
          <Button
            disabled={state.status === "loading"}
            tw={state.status === "loading" ? "opacity-45" : ""}
            onPress={() => claimNFT({ minterAddress: edition.minter_address })}
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
};
