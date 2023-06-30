import { memo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ResizeMode } from "expo-av";

import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { ListMedia } from "app/components/media";
import { RouteComponent } from "app/components/route-component";
import { DESKTOP_CONTENT_WIDTH } from "app/constants/layout";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { ClaimButtonSimplified } from "../claim/claim-button-simplified";
import { NSFWGate } from "../feed-item/nsfw-gate";

type TrendingItemProps = ViewProps & {
  index: number;
  nft: NFT;
  width?: number;
  numColumns: number;
  tw?: string;
};
export const TrendingItem = memo<TrendingItemProps>(function TrendingItem({
  index,
  nft,
  width,
  tw = "",
  numColumns = 3,
  style,
  ...rest
}) {
  const { data: edition, loading } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );
  const { width: windowWidth } = useWindowDimensions();
  const isMdWidth = windowWidth > breakpoints["md"];
  const pagerWidth = isMdWidth ? DESKTOP_CONTENT_WIDTH : windowWidth;
  const spacing = (isMdWidth ? 0 : 32) + 24 * (numColumns - 1);
  const mediaWidth =
    numColumns % 1 === 0
      ? (pagerWidth - spacing) / numColumns
      : pagerWidth / numColumns - 16;

  const router = useRouter();
  return (
    <View
      tw={["h-full w-full", tw]}
      style={[
        {
          width: Platform.select({
            web: undefined,
            default: width,
          }),
        },
        style,
      ]}
      {...rest}
    >
      <RouteComponent
        as={getNFTSlug(nft)}
        href={`${getNFTSlug(
          nft
        )}?initialScrollIndex=${index}&filter=all&type=trendingNFTs`}
      >
        <View
          tw="overflow-hidden rounded-2xl"
          style={{ width: mediaWidth, height: mediaWidth }}
        >
          <ListMedia
            item={nft}
            resizeMode={ResizeMode.COVER}
            optimizedWidth={350}
            loading={index > 0 ? "lazy" : "eager"}
          />
          <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
          <View tw="absolute left-0 top-0 h-7 w-7 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-black/50">
            <Text tw="font-bold text-white" style={{ fontSize: 15 }}>
              {index + 1}
            </Text>
          </View>
        </View>
      </RouteComponent>
      <View tw="mt-1.5 flex-row items-center">
        <AvatarHoverCard
          username={nft?.creator_username || nft?.creator_address_nonens}
          url={nft.creator_img_url}
          size={30}
        />
        <View tw="w-2" />
        <Text
          onPress={() =>
            router.push(`/@${nft.creator_username ?? nft.creator_address}`)
          }
          numberOfLines={1}
          tw="text-13 inline-block max-w-[128px] flex-nowrap overflow-hidden text-ellipsis whitespace-nowrap font-medium text-gray-900 dark:text-white"
        >
          {getCreatorUsernameFromNFT(nft)}
        </Text>
        <View tw="w-1" />
        <VerificationBadge size={12} />
      </View>
      <RouteComponent
        as={getNFTSlug(nft)}
        href={`${getNFTSlug(
          nft
        )}?initialScrollIndex=${index}&filter=all&type=trendingNFTs`}
        tw="mt-2.5"
      >
        <Text
          tw="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
          style={{ maxWidth: mediaWidth }}
        >
          {nft?.token_name}
        </Text>
      </RouteComponent>
      <View tw="mt-2.5 flex-row items-center" style={{ maxWidth: mediaWidth }}>
        <ClaimButtonSimplified edition={edition} loading={loading} />
        {edition ? (
          <Text tw="ml-3 text-xs font-bold text-gray-900 dark:text-white">
            {`${edition?.total_claimed_count.toLocaleString()}/${
              edition?.creator_airdrop_edition.edition_size > 0
                ? `${edition?.creator_airdrop_edition.edition_size.toLocaleString()}`
                : "∞"
            }`}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

export const TrendingSkeletonItem = memo<{ numColumns: number } & ViewProps>(
  function TrendingSkeletonItem({ tw = "", numColumns, ...rest }) {
    const { width: windowWidth } = useWindowDimensions();
    const isMdWidth = windowWidth > breakpoints["md"];
    const pagerWidth = isMdWidth ? DESKTOP_CONTENT_WIDTH : windowWidth;

    const spacing = (isMdWidth ? 0 : 32) + 24 * (numColumns - 1);
    const mediaWidth =
      numColumns % 1 === 0
        ? (pagerWidth - spacing) / numColumns
        : pagerWidth / numColumns - 16;

    return (
      <View tw={["", tw]} {...rest}>
        <Skeleton width={mediaWidth} height={mediaWidth} radius={16} />
        <View tw="my-1 flex-row items-center">
          <Skeleton width={30} height={30} radius={999} />
          <View tw="w-2" />
          <Skeleton width={60} height={16} radius={4} />
        </View>
        <View tw="h-2" />
        <Skeleton width={140} height={13} radius={4} />
        <View tw="h-2" />
        <Skeleton width={80} height={24} radius={999} />
      </View>
    );
  }
);
