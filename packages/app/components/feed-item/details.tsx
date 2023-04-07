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

import { ContentTypeTooltip } from "../content-type-tooltip";
import { RaffleTooltip } from "./raffle-tooltip";

type NFTDetailsProps = {
  nft: NFT;
  edition?: CreatorEditionResponse;
  detail?: NFT | undefined;
};

export const NFTDetails = ({ nft, edition, detail }: NFTDetailsProps) => {
  const description = useMemo(
    () =>
      linkifyDescription(
        removeTags(nft?.token_description),
        "text-13 font-bold text-gray-100"
      ),
    [nft?.token_description]
  );

  return (
    <View tw="px-4 pb-4 pr-20 pt-6" pointerEvents="box-none">
      <View tw="flex flex-row justify-between">
        <View tw="flex-1 flex-col justify-end">
          <View>
            <View tw="z-9 absolute -top-6">
              <ContentTypeTooltip edition={edition} theme="dark" />
            </View>
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
                tw="web:inline flex text-xs font-semibold text-white dark:text-white md:text-gray-900"
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

          {edition ? (
            <View tw="mt-4 flex-row">
              <ClaimButton
                tw="flex-1"
                edition={edition}
                size="regular"
                theme="dark"
              />
              <ClaimedShareButton
                tw="ml-3 w-1/3"
                edition={edition}
                size="regular"
                theme="dark"
              />
            </View>
          ) : (
            <View tw="mt-4 h-12" />
          )}
        </View>
      </View>
    </View>
  );
};
