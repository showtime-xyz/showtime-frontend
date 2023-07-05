import { memo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Sendv2, MoreHorizontal } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

import { FeedSocialButton } from "../feed-social-button";
import { NFTDropdown } from "../nft-dropdown";
import { ClaimButtonIconic } from "./claim-button-iconic";
import { FeedCommentButton } from "./feed-comment-button";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
  edition?: CreatorEditionResponse;
};

export const FeedEngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "", edition }) {
    const { shareNFT } = useShareNFT();
    const isDark = useIsDarkMode();
    return (
      <View tw={["ml-4", tw]}>
        <View tw="z-10">
          <ClaimButtonIconic nft={nft} tw="mb-4" />
          <FeedCommentButton nft={nft} tw="mb-4" />
          <FeedSocialButton
            onPress={() => shareNFT(nft)}
            text="Share"
            tw="mb-4"
            buttonTw="bg-gray-100 dark:bg-gray-900"
          >
            <View tw="h-0.5" />
            <Sendv2 color={isDark ? colors.white : colors.gray[900]} />
          </FeedSocialButton>
        </View>
      </View>
    );
  }
);
