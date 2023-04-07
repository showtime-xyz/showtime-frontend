import { useMemo } from "react";
import { Text as RNText } from "react-native";

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
import { getCreatorUsernameFromNFT, removeTags } from "app/utilities";

import { EngagementIcons } from "./engagement-icons";
import { RaffleTooltip } from "./raffle-tooltip";

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

  return (
    <View tw="px-4 pb-2 pt-6">
      <View tw="flex flex-row justify-between">
        <View tw="flex-1 flex-col justify-end">
          <View>
            <View tw="mb-3 flex-row justify-between">
              <RaffleTooltip edition={edition} theme="dark" />
              <View />
            </View>

            <View tw="mb-3 flex flex-row items-center justify-between">
              <Text tw="flex-1 text-sm font-bold text-white dark:text-white md:text-gray-900">
                {nft.token_name}
              </Text>
            </View>

            <Text>
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
              <Text tw="text-xs text-gray-200 dark:text-gray-200 md:text-gray-600">
                {description}
              </Text>
            </Text>
            <ClaimedBy
              claimersList={detail?.multiple_owners_list}
              nft={nft}
              tw="mt-3"
            />
          </View>

          {edition && (
            <View tw="mt-4 flex-row">
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
        <EngagementIcons nft={nft} />
      </View>
    </View>
  );
};
