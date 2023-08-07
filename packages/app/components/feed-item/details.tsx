import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import {
  ContentTypeTooltip,
  CollectToUnlockContentTooltip,
} from "app/components/tooltips";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { linkifyDescription } from "app/lib/linkify";
import { TextLink } from "app/navigation/link";
import type { NFT } from "app/types";
import {
  cleanUserTextInput,
  getCreatorUsernameFromNFT,
  limitLineBreaks,
  removeTags,
} from "app/utilities";

import { CreatorOnFeed } from "../creator-on-feed";
import { EngagementIcons } from "./engagement-icons";
import { RaffleTooltip } from "./raffle-tooltip";

type NFTDetailsProps = {
  nft: NFT;
  edition?: CreatorEditionResponse;
  detail?: NFT | undefined;
  bottomPadding?: number;
  tw?: string;
  channelId: number | null | undefined;
};

export const NFTDetails = ({
  nft,
  edition,
  detail,
  bottomPadding,
  tw = "",
  channelId,
}: NFTDetailsProps) => {
  const router = useRouter();
  const description = useMemo(
    () =>
      nft?.token_description
        ? linkifyDescription(
            limitLineBreaks(
              cleanUserTextInput(removeTags(nft?.token_description))
            ),
            "text-13 font-bold text-white"
          )
        : "",
    [nft?.token_description]
  );

  return (
    <View tw={tw} pointerEvents="box-none">
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        start={[1, 0]}
        end={[1, 1]}
        locations={[0.05, 0.8]}
        colors={["rgba(12,12,12,0)", "rgba(12,12,12,.8)"]}
      />
      <View tw="px-4 pb-4 pt-6" style={{ paddingBottom: bottomPadding }}>
        <View tw="flex-row justify-between">
          <View tw="flex-1">
            <CreatorOnFeed nft={nft} dark />
            <View tw="mb-2.5 mt-3 flex flex-row items-center justify-between">
              <Text
                tw="flex-1 text-base font-bold leading-6 text-white dark:text-white md:text-gray-900"
                numberOfLines={2}
              >
                {nft.token_name}
              </Text>
            </View>
            {/* Even though `key` is usually not allowed with FlashList, it is ok in this case, since we have single item lists */}
            <Text key={nft.nft_id}>
              <TextLink
                href={`/@${nft.creator_username ?? nft.creator_address}`}
                tw="web:inline flex text-sm font-semibold leading-5 text-white dark:text-white md:text-gray-900"
              >
                {getCreatorUsernameFromNFT(nft)}
                {nft.creator_verified ? (
                  <>
                    {` `}
                    <VerificationBadge
                      size={12}
                      fillColor="#000"
                      bgColor="#FFF"
                      className="web:inline"
                    />
                    {`  `}
                  </>
                ) : null}
              </TextLink>

              <Text tw="text-sm text-gray-200 dark:text-gray-200 md:text-gray-600">
                {description}
              </Text>
            </Text>
            <View tw="-ml-1 mt-2 h-6 flex-row justify-start">
              {edition?.gating_type === "paid_nft" ? (
                <CollectToUnlockContentTooltip
                  creatorUsername={nft?.creator_username}
                  price={edition?.price}
                  currency={edition?.currency}
                  theme="dark"
                />
              ) : (
                <ContentTypeTooltip edition={edition} theme="dark" />
              )}
              <RaffleTooltip edition={edition} theme="dark" tw="mr-1" />
            </View>
          </View>
          <EngagementIcons nft={nft} edition={edition} />
        </View>
        <View tw="mt-4 h-12 flex-row">
          {edition ? (
            <View tw="flex-1 flex-row">
              <ClaimButton
                tw="flex-1"
                edition={edition}
                nft={nft}
                size="regular"
                theme="dark"
              />
              {edition.gating_type === "paid_nft" ? (
                <>
                  <View tw="w-4" />
                  {edition?.is_already_claimed && channelId ? (
                    <Button
                      size="regular"
                      onPress={() => {
                        router.push(`/channels/${channelId}`);
                      }}
                      tw="flex-1"
                      theme="dark"
                    >
                      View Channel
                    </Button>
                  ) : null}
                </>
              ) : null}
            </View>
          ) : null}
        </View>
        <View tw="mt-3 h-5 items-center">
          <ClaimedBy
            claimersList={detail?.multiple_owners_list}
            nft={nft}
            textColor="#fff"
          />
        </View>
      </View>
    </View>
  );
};
