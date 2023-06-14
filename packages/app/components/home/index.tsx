import { useCallback, useMemo } from "react";
import { useWindowDimensions, Dimensions, Platform } from "react-native";

import { ResizeMode } from "expo-av";

import { ClampText } from "@showtime-xyz/universal.clamp-text";
import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useFeed } from "app/hooks/use-feed";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { linkifyDescription } from "app/lib/linkify";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { TextLink } from "app/navigation/link";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT, removeTags } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { ClaimedBy } from "../feed-item/claimed-by";
import { NSFWGate } from "../feed-item/nsfw-gate";
import { FollowButtonSmall } from "../follow-button-small";
import { ListMedia } from "../media";
import { ContentType } from "./content-type";
import { FeedEngagementIcons } from "./engagement-icons";
import { ListHeaderComponent } from "./header";
import { PopularCreators } from "./popular-creators";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ContentItem = ({
  nft,
  mediaSize,
  index,
}: {
  nft: NFT;
  index: number;
  mediaSize: number;
}) => {
  const description = useMemo(
    () => linkifyDescription(removeTags(nft?.token_description)),
    [nft?.token_description]
  );

  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  return (
    <View tw="mb-2 mt-6 px-4 md:px-0">
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
            {`${0}Followers`}
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
        <ClampText
          tw="text-sm text-gray-600 dark:text-gray-400"
          maxLines={4}
          text={description}
        />

        {detailData?.data?.item?.multiple_owners_list &&
        detailData.data.item.multiple_owners_list.length > 0 ? (
          <View tw="mt-3">
            <ClaimedBy
              claimersList={detailData?.data.item?.multiple_owners_list}
              nft={nft}
            />
          </View>
        ) : null}
        <View tw="mt-3 flex-row items-center">
          <View
            tw="overflow-hidden rounded-2xl"
            style={{
              width: mediaSize,
              height: mediaSize,
            }}
          >
            <ListMedia
              item={nft}
              resizeMode={ResizeMode.COVER}
              optimizedWidth={300}
              loading={index > 0 ? "lazy" : "eager"}
            />
            <View tw="absolute right-1.5 top-1.5">
              <ContentType edition={edition} />
            </View>
            <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
          </View>
          <FeedEngagementIcons nft={nft} edition={edition} />
        </View>
      </View>
    </View>
  );
};
export const Home = () => {
  const bottom = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const bottomBarHeight = usePlatformBottomHeight();
  const isMdWidth = width >= breakpoints["md"];
  const { data } = useFeed();
  const mediaSize = isMdWidth ? 300 : width - 48 - 56;
  const keyExtractor = useCallback((item: any, index: any) => `${index}`, []);
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => {
      if (index === 0) {
        return (
          <View>
            <ContentItem nft={item} mediaSize={mediaSize} index={index} />
            <PopularCreators />
          </View>
        );
      }
      return <ContentItem nft={item} mediaSize={mediaSize} index={index} />;
    },
    [mediaSize]
  );
  return (
    <View tw="w-full flex-1 items-center bg-white dark:bg-black md:pt-8">
      <View tw="max-w-screen-content w-full">
        <InfiniteScrollList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={600}
          overscan={8}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingBottom: bottom,
            paddingTop: headerHeight,
          }}
          useWindowScroll={isMdWidth}
          style={{
            height: Platform.select({
              default: windowHeight - bottomBarHeight,
              web: isMdWidth ? undefined : windowHeight - bottomBarHeight,
              ios: windowHeight,
            }),
          }}
        />
      </View>
    </View>
  );
};
