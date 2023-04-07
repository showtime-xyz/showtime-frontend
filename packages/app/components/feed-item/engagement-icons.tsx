import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Share } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { useShareNFT } from "app/hooks/use-share-nft";
import type { NFT } from "app/types";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { GiftButtonVertical } from "../claim/gift-button";
import { CommentButton } from "../feed/comment-button";
import { Like } from "../feed/like";
import { SocialButton } from "../social-button";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
  bottomHeight?: number;
};

export const EngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "", bottomHeight = 0 }) {
    const { width } = useWindowDimensions();
    const { shareNFT } = useShareNFT();
    return (
      <View
        pointerEvents="box-none"
        tw={["absolute bottom-0 right-0 flex-col pr-3", tw]}
        style={{ paddingBottom: bottomHeight }}
      >
        <View style={{ height: bottomHeight }} pointerEvents="none" />
        <LinearGradient
          pointerEvents="none"
          style={{
            overflow: "hidden",
            width: width + 200,
            height: "100%",
            position: "absolute",
            left: -width,
          }}
          start={[1, 0]}
          end={[1, 1]}
          locations={[0.01, 0.8]}
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,.8)"]}
        ></LinearGradient>
        <View tw="relative -top-8 z-10">
          <AvatarHoverCard
            username={nft?.creator_username || nft?.creator_address_nonens}
            url={nft.creator_img_url}
            borderColor="#FFF"
            tw="border"
            size={36}
          />
          <View tw="h-7" />
          <Like vertical nft={nft} />
          <View tw="h-4" />
          <CommentButton vertical nft={nft} />
          <View tw="h-4" />
          <GiftButtonVertical vertical nft={nft} />
          <View tw="h-8" />
          <SocialButton onPress={() => shareNFT(nft)}>
            <Share height={32} width={32} color="#FFF" />
          </SocialButton>
        </View>
      </View>
    );
  }
);
