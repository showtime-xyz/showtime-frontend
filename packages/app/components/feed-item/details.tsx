import { useMemo } from "react";
import { Text as RNText } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Raffle, Share } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { GiftButton } from "app/components/claim/gift-button";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { SocialButton } from "app/components/social-button";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import { linkifyDescription } from "app/lib/linkify";
import { TextLink } from "app/navigation/link";
import type { NFT } from "app/types";
import {
  getCreatorUsernameFromNFT,
  getFormatDistanceStrictToWeek,
  removeTags,
} from "app/utilities";

import { TextTooltip } from "../text-tooltip";

type NFTDetailsProps = {
  nft: NFT;
  edition?: CreatorEditionResponse;
  detail?: NFT | undefined;
};

export const NFTDetails = ({ nft, edition, detail }: NFTDetailsProps) => {
  const isDark = useIsDarkMode();
  const { shareNFT } = useShareNFT();
  const isCreatorDrop = !!nft.creator_airdrop_edition_address;
  const description = useMemo(
    () => linkifyDescription(removeTags(nft?.token_description)),
    [nft?.token_description]
  );
  return (
    <View tw="px-4 pt-4">
      <View tw="flex flex-row justify-between">
        <View tw="flex-1">
          <View tw="mb-3 flex flex-row items-center justify-between">
            {edition?.gating_type === "music_presave" && (
              <TextTooltip
                triggerElement={
                  <View tw="mr-2 flex flex-row items-center rounded-full border-2 border-[#F7FF97]">
                    <Raffle color="#F7FF97" width={28} height={28} />
                  </View>
                }
                text="Collect to enter a raffle"
              />
            )}

            <Text tw="flex-1 text-2xl dark:text-white" numberOfLines={3}>
              {nft.token_name}
              <Text tw="text-base font-semibold text-gray-900 dark:text-gray-400">
                {` · `}
              </Text>
              <Text tw="self-center text-xs font-semibold text-gray-900 dark:text-gray-200">
                {getFormatDistanceStrictToWeek(nft.token_created)}
              </Text>
            </Text>
          </View>
          <ClaimedBy
            claimersList={detail?.multiple_owners_list}
            nft={nft}
            tw="mb-4"
          />
          <RNText>
            <TextLink
              href={`/@${nft.creator_username ?? nft.creator_address}`}
              tw="flex text-sm font-semibold text-gray-900 dark:text-white"
            >
              {getCreatorUsernameFromNFT(nft)}
            </TextLink>
            <RNText>
              {` `}
              {nft.creator_verified ? <VerificationBadge size={12} /> : null}
              {` `}
            </RNText>
            <Text tw="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </Text>
          </RNText>
        </View>
        <View tw="w-20 items-end">
          <View tw="flex-col items-center">
            <AvatarHoverCard
              username={nft?.creator_username || nft?.creator_address_nonens}
              url={nft.creator_img_url}
            />
            <View tw="h-6" />
            <Like vertical nft={nft} />
            <View tw="h-6" />
            <CommentButton vertical nft={nft} />
            <View tw="h-6" />
            <GiftButton vertical nft={nft} />
            <View tw="h-6" />
          </View>
        </View>
      </View>
      <View tw="my-2 flex flex-row items-center">
        <View tw="flex-1 flex-row">
          {isCreatorDrop && edition ? (
            <View tw="flex-1 flex-row">
              <ClaimButton tw="flex-1" edition={edition} size="regular" />
              <ClaimedShareButton
                tw="ml-3 w-1/3"
                edition={edition}
                size="regular"
              />
            </View>
          ) : isCreatorDrop ? (
            <View tw="h-12 flex-1" />
          ) : null}
        </View>
        <SocialButton onPress={() => shareNFT(nft)} tw="ml-4 pr-2">
          <Share
            height={24}
            width={24}
            color={isDark ? "#FFF" : colors.gray[900]}
          />
        </SocialButton>
      </View>
    </View>
  );
};
