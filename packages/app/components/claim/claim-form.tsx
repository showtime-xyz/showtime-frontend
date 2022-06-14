import React from "react";
import { Linking, Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Check } from "@showtime-xyz/universal.icon";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { useMyInfo } from "app/hooks/api-hooks";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useShare } from "app/hooks/use-share";
import { useRouter } from "app/navigation/use-router";
import {
  formatAddressShort,
  getCreatorUsernameFromNFT,
  getTwitterIntent,
} from "app/utilities";

export const ClaimForm = ({ edition }: { edition: CreatorEditionResponse }) => {
  const { state, claimNFT } = useClaimNFT();
  const share = useShare();
  const router = useRouter();

  const { userAddress } = useCurrentUserAddress();

  const { data: nft } = useNFTDetailByTokenId({
    //@ts-ignore
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition.creator_airdrop_edition.contract_address,
  });

  const { follow } = useMyInfo();

  const { mutate } = useCreatorCollectionDetail(
    nft?.data.item.creator_airdrop_edition_address
  );

  const handleClaimNFT = async () => {
    if (nft?.data.item.creator_id) {
      follow(nft?.data.item.creator_id);
    }

    await claimNFT({
      minterAddress: edition.creator_airdrop_edition.minter_address,
    });

    mutate();
  };

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
    const claimUrl = `https://showtime.xyz/t/${[
      process.env.NEXT_PUBLIC_CHAIN_ID,
    ]}/${edition?.creator_airdrop_edition.contract_address}/0`;

    const isShareAPIAvailable = Platform.select({
      default: true,
      web: typeof window !== "undefined" && !!navigator.share,
    });

    return (
      <View tw="items-center justify-center p-4">
        <Text tw="text-8xl">🎉</Text>
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
              Linking.openURL(
                getTwitterIntent({
                  url: claimUrl,
                  message: `I just claimed a free NFT "${nft?.data.item.token_name}" by @${nft?.data.item.creator_name} on @Showtime_xyz! 🎁🔗\n\nClaim yours for free here:`,
                })
              )
            }
            tw="bg-[#00ACEE]"
            variant="text"
          >
            <Text tw="text-white">Share on Twitter</Text>
          </Button>
          <View tw="h-4" />
          <Button
            onPress={() =>
              share({
                url: claimUrl,
              })
            }
          >
            {isShareAPIAvailable
              ? "Share NFT with your friends"
              : "Copy drop link 🔗"}
          </Button>
          <Button variant="tertiary" tw="mt-4" onPress={router.pop}>
            Skip for now
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView>
      <View tw="flex-1 items-start p-4">
        <View tw="flex-row flex-wrap">
          <Media item={nft?.data.item} tw="h-20 w-20 rounded-lg" />
          <View tw="ml-4 flex-1">
            <Text
              tw="text-xl font-bold text-black dark:text-white"
              numberOfLines={2}
            >
              {edition.creator_airdrop_edition.name}
            </Text>
            <View tw="h-2" />
            <Text tw="text-gray-700 dark:text-gray-400">
              {getCreatorUsernameFromNFT(nft?.data.item)}
            </Text>
          </View>
        </View>
        <View tw="mt-4 w-full">
          <View tw="mb-4">
            <Text tw="text-gray-900 dark:text-gray-100">
              {edition.creator_airdrop_edition.description}
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
                1/{edition.creator_airdrop_edition.edition_size}
              </Text>
            </View>
          </View>

          <View tw="mt-4 flex-row items-center">
            <Check
              height={20}
              width={20}
              //@ts-ignore
              color={tw.style("bg-gray-900 dark:bg-gray-100").backgroundColor}
            />
            <Text tw="ml-1 text-gray-900 dark:text-gray-100">
              You'll follow {getCreatorUsernameFromNFT(nft?.data.item)}
            </Text>
          </View>
          <View tw="mt-4">
            <Button
              disabled={state.status === "loading"}
              tw={state.status === "loading" ? "opacity-45" : ""}
              onPress={handleClaimNFT}
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

          {state.error ? (
            <View tw="mt-4">
              <Text tw="text-red-500">{state.error}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};
