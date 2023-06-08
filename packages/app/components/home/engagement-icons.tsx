import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Sendv2, Share } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";

import { GiftButtonVertical } from "../claim/gift-button";
import { FeedSocialButton } from "../feed-social-button";
import { CommentButton } from "../feed/comment-button";
import { SocialButton } from "../social-button";
import { FeedCommentButton } from "./feed-comment-button";
import { ShowtimeClaimButton } from "./showtime-button";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
  edition?: CreatorEditionResponse;
};

export const FeedEngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "", edition }) {
    const { shareNFT } = useShareNFT();

    return (
      <View tw={["ml-4", tw]}>
        <View tw="relative z-10">
          <ShowtimeClaimButton nft={nft} tw="mb-4" />
          <FeedCommentButton nft={nft} tw="mb-4" />
          <FeedSocialButton tw="mb-4" onPress={() => shareNFT(nft)}>
            <Sendv2 color="#000" />
          </FeedSocialButton>
        </View>
      </View>
    );
  }
);
