import { memo, useCallback } from "react";
import {
  useWindowDimensions,
  Dimensions,
  Platform,
  ListRenderItemInfo,
} from "react-native";

import { ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { DESKTOP_CONTENT_WIDTH } from "app/constants/layout";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Carousel } from "app/lib/carousel";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { TextLink } from "app/navigation/link";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { ClaimButtonSimplified } from "../claim/claim-button-simplified";
import { NSFWGate } from "../feed-item/nsfw-gate";
import { ListMedia } from "../media";
import { HomeSlider } from "./home-slider";

const windowWidth = Dimensions.get("window").width;
const TrendingItem = ({ index, nft, width, style }: any) => {
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  return (
    <View
      tw="h-full w-full pb-4"
      style={{
        width: Platform.select({
          web: undefined,
          default: width,
        }),
      }}
    >
      <View tw="h-[124px] w-[124px] overflow-hidden rounded-2xl">
        <ListMedia
          item={nft}
          resizeMode={ResizeMode.COVER}
          optimizedWidth={248}
          loading={index > 0 ? "lazy" : "eager"}
        />
        <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
        <View tw="absolute left-0 top-0 h-7 w-7 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-black">
          <Text tw="font-bold text-white" style={{ fontSize: 15 }}>
            {index + 1}
          </Text>
        </View>
      </View>
      <View tw="mt-1.5 flex-row items-center">
        <AvatarHoverCard
          username={nft?.creator_username || nft?.creator_address_nonens}
          url={nft.creator_img_url}
          size={30}
        />
        <View tw="w-2" />
        <TextLink
          href={`/@${nft.creator_username ?? nft.creator_address}`}
          tw="inline-block max-w-[100px] flex-nowrap overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
        >
          {getCreatorUsernameFromNFT(nft)}
        </TextLink>
        <View tw="w-1" />
        <VerificationBadge size={12} />
      </View>
      <View tw="mt-2">
        <Text tw="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
          {nft?.token_name}
        </Text>
      </View>
      {edition && (
        <View tw="mt-2.5 flex-row items-center">
          <ClaimButtonSimplified edition={edition} tw="mr-3" />
          <Text tw="text-xs font-bold text-gray-900 dark:text-white">
            {edition?.total_claimed_count.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};
export const ListHeaderComponent = memo(function ListHeaderComponent() {
  const bottom = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { data, mutate, isLoading } = useTrendingNFTS({});
  const router = useRouter();
  const pagerWidth = isMdWidth ? DESKTOP_CONTENT_WIDTH : windowWidth - 32;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => (
      <TrendingItem
        nft={item}
        index={index}
        width={Platform.select({ web: undefined, default: pagerWidth / 2 })}
      />
    ),
    [pagerWidth]
  );

  return (
    <View tw="w-full">
      <View tw="web:mt-12 web:md:mt-0 px-4 md:px-0">
        <Carousel
          loop
          width={pagerWidth}
          height={isMdWidth ? 164 : 104}
          autoPlayInterval={3000}
          data={new Array(5).fill(0)}
          controller
          tw="mb-2 w-full rounded-2xl"
          pagination={{ variant: "rectangle" }}
          renderItem={({ index }) => (
            <LinearGradient
              key={index}
              colors={["#98C4FF", "#5EFEFE", "#FFE8B6"]}
              start={{ x: -0.08, y: 0.36 }}
              end={{ x: 1.08, y: 0.63 }}
              style={{
                width: pagerWidth,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 60,
              }}
            >
              <Text
                style={{
                  fontSize: isMdWidth ? 40 : 23,
                  lineHeight: isMdWidth ? 48 : 28,
                }}
                tw="text-center font-semibold text-gray-600"
              >
                Engage everyone with accessible web3 tools
              </Text>
            </LinearGradient>
          )}
        />
      </View>
      {data.length > 0 && (
        <View tw="w-full pl-4 md:pl-0">
          <View tw="w-full flex-row items-center justify-between py-4 pr-4">
            <Text tw="text-sm font-bold text-gray-900 dark:text-white">
              Trending
            </Text>
            <Text
              tw="text-sm font-semibold text-indigo-700"
              onPress={() => {
                router.push("/trending");
              }}
            >
              see all
            </Text>
          </View>
          <View tw="mb-8 w-full rounded-2xl">
            <HomeSlider data={data} renderItem={renderItem} />
          </View>
        </View>
      )}
    </View>
  );
});
