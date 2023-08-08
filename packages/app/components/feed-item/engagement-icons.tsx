import { memo } from "react";

import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";

import { FeedCommentButton } from "../home/feed-comment-button";
import { NFTShareDropdown } from "../nft-share-dropdown";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
  edition?: CreatorEditionResponse;
  bottomPadding?: number;
};

export const EngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "", bottomPadding = 0 }) {
    return (
      <View
        pointerEvents="box-none"
        tw={["flex-col justify-center", tw]}
        style={{ paddingBottom: bottomPadding }}
      >
        <View style={{ height: bottomPadding }} pointerEvents="none" />
        <View tw="z-10">
          <FeedCommentButton nft={nft} dark tw="mb-4" />
          <NFTShareDropdown nft={nft} dark />
        </View>
      </View>
    );
  }
);
