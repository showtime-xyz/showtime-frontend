import { useMemo } from "react";
import { Text as RNText } from "react-native";

import { Raffle } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
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
  const description = useMemo(
    () => linkifyDescription(removeTags(nft?.token_description)),
    [nft?.token_description]
  );
  console.log(edition);

  return (
    <View tw="px-4 pb-4 pr-16 pt-6">
      <View tw="flex flex-row justify-between">
        <View tw="flex-1 flex-col justify-between">
          <View tw="">
            <View tw="mb-3 flex flex-row items-center justify-between">
              {edition?.raffles && edition?.raffles?.length > 0 && (
                <TextTooltip
                  triggerElement={
                    <View tw="mr-2 flex flex-row items-center rounded-full border-2 border-[#F7FF97]">
                      <Raffle color="#F7FF97" width={28} height={28} />
                    </View>
                  }
                  text="Collect to enter a raffle"
                />
              )}

              <Text
                tw="flex-1 text-2xl text-white dark:text-white md:text-gray-900"
                numberOfLines={3}
              >
                {nft.token_name}
                <Text tw="text-base font-semibold text-gray-400 dark:text-gray-400 md:text-gray-900">
                  {` · `}
                </Text>
                <Text tw="self-center text-xs font-semibold text-gray-200 dark:text-gray-200 md:text-gray-900">
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
                tw="web:inline flex text-sm font-semibold text-white dark:text-white md:text-gray-900"
              >
                {getCreatorUsernameFromNFT(nft)}
              </TextLink>
              <RNText>
                {` `}
                {nft.creator_verified ? (
                  <VerificationBadge
                    size={12}
                    fillColor="#000"
                    bgColor="#FFF"
                    className="web:inline"
                  />
                ) : null}
                {` `}
              </RNText>
              <Text tw="text-sm text-gray-200 dark:text-gray-200 md:text-gray-600">
                {description}
              </Text>
            </RNText>
          </View>
          {edition && (
            <View tw="mt-2 flex-row">
              <ClaimButton
                tw="flex-1"
                edition={edition}
                color="#000"
                size="regular"
                variant="base"
                labelTW="text-black md:text-white dark:text-black"
                backgroundColors={{
                  default: "bg-white md:bg-gray-900 dark:bg-white",
                  pressed: "bg-gray-200 md:bg-gray-700 dark:bg-gray-200",
                }}
              />
              <ClaimedShareButton
                tw="ml-3 w-1/3"
                edition={edition}
                size="regular"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
