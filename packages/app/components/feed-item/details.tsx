import { useMemo } from "react";

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
    <View tw="px-4 pb-4 pr-20 pt-6" pointerEvents="box-none">
      <View tw="flex flex-row justify-between">
        <View tw="flex-1 flex-col justify-end">
          <View>
            <View tw="-ml-1 -mt-5 mb-3 h-6 flex-row justify-start">
              <RaffleTooltip edition={edition} theme="dark" tw="mr-1" />
              <ContentTypeTooltip edition={edition} theme="dark" />
            </View>

            <View tw="mb-2.5 flex flex-row items-center justify-between">
              <Text
                tw="flex-1 text-base font-bold leading-6 text-white dark:text-white md:text-gray-900"
                numberOfLines={2}
              >
                {nft.token_name}
              </Text>
            </View>
            <Text key={nft.nft_id}>
              {/* Even though `key` is usually not allowed with FlashList, it is ok in this case, since we have single item lists */}
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
            <View tw="mt-3 h-5">
              <ClaimedBy
                claimersList={detail?.multiple_owners_list}
                nft={nft}
                textColor="#fff"
              />
            </View>
          </View>

          <View tw="mt-4 h-12 flex-row">
            {edition ? (
              <ClaimButton
                tw="flex-1"
                edition={edition}
                size="regular"
                theme="dark"
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
