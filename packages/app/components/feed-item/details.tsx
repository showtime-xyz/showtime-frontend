import { Suspense } from "react";
import { Pressable } from "react-native";

import { Share } from "@showtime-xyz/universal.icon";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { ClaimButton } from "app/components/claim/claim-button";
import { GiftButton } from "app/components/claim/gift-button";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { NFTDropdown } from "app/components/nft-dropdown";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

export const NFTDetails = ({
  nft,
  listId,
  edition,
}: {
  nft: NFT;
  edition?: CreatorEditionResponse;
  listId?: number;
}) => {
  const { shareNFT } = useShareNFT();
  const isCreatorDrop = !!nft.creator_airdrop_edition_address;

  return (
    <View>
      <View tw="flex-row items-center justify-between px-4">
        <Creator nft={nft} shouldShowCreatorIndicator={false} />
        {isCreatorDrop && edition ? <ClaimButton edition={edition} /> : null}
        {/* {!isCreatorDrop ? <BuyButton nft={nft} /> : null} */}
      </View>

      <View tw="px-4">
        <Text tw="font-space-bold text-lg dark:text-white" numberOfLines={3}>
          {nft.token_name}
        </Text>

        <View tw="h-4" />

        <View tw="flex-row justify-between">
          <View tw="flex-row">
            <Like nft={nft} />
            <View tw="w-6" />
            <CommentButton nft={nft} />
            <View tw="w-6" />
            <GiftButton nft={nft} />
          </View>

          <View tw="flex-row">
            <Pressable onPress={() => shareNFT(nft)}>
              <Share
                height={32}
                width={22}
                // @ts-ignore
                color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
              />
            </Pressable>
            <View tw="w-8" />

            <Suspense fallback={<Skeleton width={24} height={24} />}>
              <NFTDropdown nft={nft} listId={listId} />
            </Suspense>
          </View>
        </View>
      </View>

      <View tw="h-4" />
    </View>
  );
};
