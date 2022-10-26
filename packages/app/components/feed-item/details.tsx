import { Suspense } from "react";

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
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { NFTDropdown } from "app/components/nft-dropdown";
import { SocialButton } from "app/components/social-button";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

import { ClaimedShareButton } from "../claim/claimed-share-button";

type NFTDetailsProps = {
  nft: NFT;
  edition?: CreatorEditionResponse;
  detail?: NFT | undefined;
};

export const NFTDetails = ({ nft, edition, detail }: NFTDetailsProps) => {
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
        maxLines={2}
        tw="max-h-[30vh] pt-2"
      />
      <View tw="flex-row justify-between py-2">
        <View tw="flex-row">
          <Like nft={nft} />
          <View tw="w-6" />
          <CommentButton nft={nft} />
          <View tw="w-6" />
          <GiftButton nft={nft} />
        </View>

        <View tw="flex-row">
          <SocialButton onPress={() => shareNFT(nft)}>
            <Share
              height={32}
              width={22}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </SocialButton>
          <View tw="w-8" />
          <Suspense fallback={<Skeleton width={24} height={24} />}>
            <NFTDropdown nft={detail ?? nft} tw="" />
          </Suspense>
        </View>
      </View>
      <ClaimedBy
        claimersList={detail?.multiple_owners_list}
        nft={nft}
        tw="mb-4"
      />
      {isCreatorDrop && edition ? (
        <View tw="flex-row">
          <ClaimButton tw="flex-1" edition={edition} size="regular" />
          <ClaimedShareButton
            tw="ml-3 w-1/3"
            edition={edition}
            size="regular"
          />
        </View>
      ) : isCreatorDrop ? (
        <View tw="h-12" />
      ) : null}
      <View tw="h-4" />
    </View>
  );
};
