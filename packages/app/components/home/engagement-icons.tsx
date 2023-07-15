import { memo } from "react";

import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";

import { NFTShareDropdown } from "../nft-share-dropdown";
import { ClaimButtonIconic } from "./claim-button-iconic";
import { FeedCommentButton } from "./feed-comment-button";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
  edition?: CreatorEditionResponse;
};

export const FeedEngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "" }) {
    return (
      <View tw={["ml-4", tw]}>
        <View tw="z-10">
          <ClaimButtonIconic nft={nft} tw="mb-4" />
          <FeedCommentButton nft={nft} tw="mb-4" />
          <NFTShareDropdown nft={nft} />
        </View>
      </View>
    );
  }
);
