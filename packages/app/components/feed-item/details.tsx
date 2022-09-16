import { Suspense } from "react";
import { Pressable } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Share } from "@showtime-xyz/universal.icon";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Description } from "app/components/card/rows/description";
import { Creator } from "app/components/card/rows/elements/creator";
import { ClaimButton } from "app/components/claim/claim-button";
import { GiftButton } from "app/components/claim/gift-button";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { NFTDropdown } from "app/components/nft-dropdown";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

type NFTDetailsProps = {
  nft: NFT;
  edition?: CreatorEditionResponse;
};
export const NFTDetails = ({ nft, edition }: NFTDetailsProps) => {
  const isDark = useIsDarkMode();
  const { shareNFT } = useShareNFT();
  const isCreatorDrop = !!nft.creator_airdrop_edition_address;

  return (
    <View tw="px-4">
      <View tw="flex-row items-center justify-between">
        <Creator nft={nft} shouldShowCreatorIndicator={false} />
      </View>
      <Text tw="font-space-bold text-lg dark:text-white" numberOfLines={3}>
        {nft.token_name}
      </Text>
      <Description
        descriptionText={nft?.token_description}
        style={{ paddingTop: 8 }}
        maxLines={2}
      />
      <View tw="h-4" />

      <View tw="mb-1 flex-row justify-between">
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
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </Pressable>
          <View tw="w-8" />
          <Suspense fallback={<Skeleton width={24} height={24} />}>
            <NFTDropdown nft={nft} />
          </Suspense>
        </View>
      </View>
      {isCreatorDrop && edition ? (
        <ClaimButton edition={edition} size="regular" />
      ) : isCreatorDrop ? (
        <View tw="h-12" />
      ) : null}
      <View tw="h-4" />
    </View>
  );
};
