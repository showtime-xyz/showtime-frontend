import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Share } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useShareNFT } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { GiftButtonVertical } from "../claim/gift-button";
import { CommentButton } from "../feed/comment-button";
import { Like } from "../feed/like";
import { NFTDropdown } from "../nft-dropdown";
import { SocialButton } from "../social-button";

export type EngagementIconsProps = {
  nft: NFT;
  tw?: string;
  edition?: CreatorEditionResponse;
  bottomPadding?: number;
};

export const EngagementIcons = memo<EngagementIconsProps>(
  function EngagementIcons({ nft, tw = "", bottomPadding = 0, edition }) {
    const { width } = useWindowDimensions();
    const { shareNFT } = useShareNFT();
    const { isAuthenticated } = useUser();

    return (
      <View
        pointerEvents="box-none"
        tw={["absolute bottom-12 right-0 flex-col pr-3", tw]}
        style={{ paddingBottom: bottomPadding }}
      >
        <View style={{ height: bottomPadding }} pointerEvents="none" />
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
        <View tw="relative -top-6 z-10">
          <AvatarHoverCard
            username={nft?.creator_username || nft?.creator_address_nonens}
            url={nft.creator_img_url}
            borderColor="#FFF"
            tw="border"
            size={36}
          />
          <View tw="h-5" />
          <Like vertical nft={nft} />
          <View tw="h-4" />
          <CommentButton vertical nft={nft} />
          <View tw="h-5" />
          <GiftButtonVertical vertical nft={nft} />
          <View tw="h-6" />
          <SocialButton onPress={() => shareNFT(nft)}>
            <Share height={32} width={32} color="#FFF" />
          </SocialButton>
          {!isAuthenticated ? (
            <>
              <View tw="h-6" />
              <NFTDropdown nft={nft} edition={edition} tw="items-center py-1" />
            </>
          ) : (
            <View tw="h-2" />
          )}
        </View>
      </View>
    );
  }
);
