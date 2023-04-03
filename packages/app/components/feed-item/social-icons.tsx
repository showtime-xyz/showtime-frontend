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

export type SocialIconsProps = {
  nft: NFT;
  tw?: string;
};

export const SocialIcons = memo<SocialIconsProps>(function FeedItem({
  nft,
  tw = "",
}) {
  const { shareNFT } = useShareNFT();
  return (
    <View tw={["absolute bottom-32 right-2 flex-col items-center", tw]}>
      <AvatarHoverCard
        username={nft?.creator_username || nft?.creator_address_nonens}
        url={nft.creator_img_url}
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
});
