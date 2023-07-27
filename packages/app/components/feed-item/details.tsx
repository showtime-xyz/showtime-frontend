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

import { toast } from "design-system/toast";

import { ContentTypeTooltip } from "../content-type-tooltip";
import { CreatorOnFeed } from "../creator-on-feed";
import { EngagementIcons } from "./engagement-icons";
import { RaffleTooltip } from "./raffle-tooltip";

type NFTDetailsProps = {
  nft: NFT;
  edition?: CreatorEditionResponse;
  detail?: NFT | undefined;
  bottomPadding?: number;
  tw?: string;
};

export const NFTDetails = ({
  nft,
  edition,
  detail,
  bottomPadding,
  tw = "",
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
            <View tw="absolute bottom-0 -ml-1 mt-3 h-6 flex-row justify-start">
              <ContentTypeTooltip edition={edition} theme="dark" />
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
                  <Button
                    size="regular"
                    onPress={() => {
                      router.push(`/channels/${nft?.creator_channel_id}`);
                    }}
                    tw="flex-1"
                    theme="dark"
                  >
                    View Channel
                  </Button>
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
