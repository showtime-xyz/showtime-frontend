import { memo } from "react";

import { Share } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { useShareNFT } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { GiftButton } from "../claim/gift-button";
import { CommentButton } from "../feed/comment-button";
import { Like } from "../feed/like";
import { SocialButton } from "../social-button";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
};

export const EngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "" }) {
    const { shareNFT } = useShareNFT();
    return (
      <View tw={["flex-col items-center justify-end pb-2 pl-5", tw]}>
        <AvatarHoverCard
          username={nft?.creator_username || nft?.creator_address_nonens}
          url={nft.creator_img_url}
          borderColor="#FFF"
          tw="border"
        />
        <View tw="h-6" />
        <Like vertical nft={nft} />
        <View tw="h-6" />
        <CommentButton vertical nft={nft} />
        <View tw="h-6" />
        <GiftButton vertical nft={nft} />
        <View tw="h-6" />
        <SocialButton onPress={() => shareNFT(nft)}>
          <Share height={24} width={24} color="#FFF" />
        </SocialButton>
      </View>
    );
  }
);
