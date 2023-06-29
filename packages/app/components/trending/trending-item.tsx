import { Platform, useWindowDimensions } from "react-native";

import { ResizeMode } from "expo-av";

import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ListMedia } from "app/components/media";
import { RouteComponent } from "app/components/route-component";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { TextLink } from "app/navigation/link";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { ClaimButtonSimplified } from "../claim/claim-button-simplified";
import { NSFWGate } from "../feed-item/nsfw-gate";

export const TrendingItem = ({
  index,
  nft,
  width,
  tw = "",
  presetWidth = 172,
}: {
  index: number;
  nft: NFT;
  width?: number;
  presetWidth?: number;
  tw?: string;
}) => {
  const { data: edition, loading } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );
  const { width: windowWidth } = useWindowDimensions();
  const isMdWidth = windowWidth > breakpoints["md"];
  const mediaWidth =
    isMdWidth || Platform.OS === "web"
      ? presetWidth
      : (windowWidth - 32 - 20) / 2;

  return (
    <View
      tw={["h-full w-full", tw]}
      style={{
        width: Platform.select({
          web: undefined,
          default: width,
        }),
      }}
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
        <TextLink
          href={`/@${nft.creator_username ?? nft.creator_address}`}
          tw="text-13 inline-block max-w-[128px] flex-nowrap overflow-hidden text-ellipsis whitespace-nowrap font-medium text-gray-900 dark:text-white"
        >
          {getCreatorUsernameFromNFT(nft)}
        </TextLink>
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
          tw="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white"
          style={{ maxWidth: mediaWidth }}
        >
          {nft?.token_name}
        </Text>
      </RouteComponent>
      <View
        tw="mt-2.5 flex-row items-center justify-between"
        style={{ maxWidth: mediaWidth }}
      >
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
};

export const TrendingSkeletonItem = ({ presetWidth = 182 }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMdWidth = windowWidth > breakpoints["md"];
  const mediaWidth =
    isMdWidth || Platform.OS === "web"
      ? presetWidth
      : (windowWidth - 32 - 20) / 2;
  return (
    <View tw="mr-2.5">
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
};
