import { useState, useRef, useCallback } from "react";
import { useWindowDimensions, Dimensions } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { DESKTOP_CONTENT_WIDTH } from "app/constants/layout";
import { useFeed } from "app/hooks/use-feed";
import { useFollow } from "app/hooks/use-follow";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Carousel } from "app/lib/carousel";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { TextLink } from "app/navigation/link";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { DEFAULT_AVATAR_PIC } from "design-system/avatar/constants";
import { breakpoints } from "design-system/theme";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { FollowButton } from "../follow-button";
import { FollowButtonSmall } from "../follow-button-small";
import { ListHeaderComponent } from "./header";
import { TrendingCarousel } from "./trending-carousel";

const windowWidth = Dimensions.get("window").width;

const ContentItem = ({ nft, index }: { nft: NFT; index: number }) => {
  return (
    <View tw="mb-4">
      <View tw="flex-row items-center">
        <AvatarHoverCard
          username={nft?.creator_username || nft?.creator_address_nonens}
          url={nft.creator_img_url}
          size={40}
        />
        <View tw="ml-2 justify-center">
          <View tw="-mt-1.5 mb-1 flex flex-row items-center">
            <TextLink
              href={`/@${nft.creator_username ?? nft.creator_address}`}
              tw="text-sm font-medium text-gray-900 dark:text-white"
            >
              {getCreatorUsernameFromNFT(nft)}
            </TextLink>

            {nft.creator_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
          <Text tw="text-xs text-gray-600 dark:text-gray-400">
            {`${123}Followers`}
          </Text>
        </View>

        <FollowButtonSmall
          profileId={nft.creator_id}
          name={nft.creator_username}
          tw="ml-auto"
        />
      </View>
      <View tw="mt-3">
        <Text tw="text-base font-bold text-gray-900 dark:text-white">
          {nft?.token_name}
        </Text>
        <View tw="h-2" />
        <Text tw="text-sm text-gray-700 dark:text-white">
          {nft?.token_description}
        </Text>
      </View>
    </View>
  );
};
export const Home = () => {
  const bottom = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { data } = useFeed();

  const keyExtractor = useCallback((item: any, index: any) => `${index}`, []);
  const renderItem = ({ item, ...rest }: ListRenderItemInfo<NFT>) => {
    return <ContentItem nft={item} {...rest} />;
  };
  return (
    <View tw="w-full flex-1 items-center bg-white dark:bg-black md:pt-8">
      <View tw="max-w-screen-content flex-1">
        <InfiniteScrollList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={64}
          overscan={8}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingBottom: bottom,
            paddingTop: headerHeight,
          }}
        />

        <View tw="mt-8">
          <Text tw="text-lg text-black dark:text-white">Home V2</Text>
        </View>
      </View>
    </View>
  );
};
