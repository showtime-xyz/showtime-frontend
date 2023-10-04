import { memo, useMemo } from "react";
import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";

import { LeanView } from "../creator-channels/components/lean-text";
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
    const style = useMemo(
      () => "ml-4 " + (Array.isArray(tw) ? tw.join(" ") : tw),
      [tw]
    );

    return (
      <LeanView tw={style}>
        <LeanView tw="z-10">
          <ClaimButtonIconic
            nft={nft}
            tw="mb-4"
            textViewStyle={Platform.select({
              android: { marginLeft: -16 },
              default: null,
            })}
          />
          <FeedCommentButton
            nft={nft}
            tw="mb-4"
            textViewStyle={Platform.select({
              android: { marginLeft: -16 },
              default: null,
            })}
          />
          <NFTShareDropdown
            nft={nft}
            textViewStyle={Platform.select({
              android: { marginLeft: -16 },
              default: null,
            })}
          />
        </LeanView>
      </LeanView>
    );
  }
);
