import { useMemo, useCallback, memo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { RouteComponent } from "app/components/route-component";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { linkifyDescription } from "app/lib/linkify";
import { Link } from "app/navigation/link";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT, removeTags } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { ClaimedBy } from "../feed-item/claimed-by";
import { NSFWGate } from "../feed-item/nsfw-gate";
import { FollowButtonSmall } from "../follow-button-small";
import { ListMedia } from "../media";
import { NFTDropdown } from "../nft-dropdown";
import { ContentType } from "./content-type";
import { FeedEngagementIcons } from "./engagement-icons";

const NativeRouteComponent = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const onItemPress = useCallback(() => {
    router.push(href);
  }, [href, router]);
  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return <Pressable onPress={onItemPress}>{children}</Pressable>;
};
export const HomeItem = memo<{
  nft: NFT;
  index: number;
  mediaSize: number;
}>(function HomeItem({ nft, mediaSize, index }) {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const isDark = useIsDarkMode();
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
    <NativeRouteComponent
      href={`${getNFTSlug(nft)}?initialScrollIndex=${index}&type=feed`}
    >
      <View tw="mb-2 mt-6 px-4 md:px-0">
        <View tw="flex-row items-center">
          <AvatarHoverCard
            username={nft?.creator_username || nft?.creator_address_nonens}
            url={nft.creator_img_url}
            size={40}
          />

          <View tw="ml-2 justify-center">
            <Link
              href={`/@${nft.creator_username ?? nft.creator_address}`}
              tw="flex-row items-center"
            >
              <Text
                numberOfLines={1}
                tw="max-w-[150px] text-sm font-medium text-gray-900 dark:text-white md:max-w-none"
              >
                {getCreatorUsernameFromNFT(nft)}
              </Text>
              {nft.creator_verified ? (
                <VerificationBadge
                  style={{
                    marginLeft: 4,
                    marginBottom: Platform.select({ web: -1, default: 0 }),
                  }}
                  size={13}
                />
              ) : null}
            </Link>
            <View tw="h-2" />
            <Text tw="text-xs text-gray-600 dark:text-gray-400">
              {`${nft?.creator_followers_count} Followers`}
            </Text>
          </View>
          <View tw="ml-auto flex-row items-center">
            <FollowButtonSmall
              profileId={nft.creator_id}
              name={nft.creator_username}
              tw="mr-4"
            />
            <NFTDropdown
              nft={nft}
              edition={edition}
              iconSize={20}
              iconColor={isDark ? colors.gray[100] : colors.gray[900]}
              shouldEnableSharing={false}
            />
          </View>
        </View>

        <View tw="mt-3" style={{ maxWidth: isMdWidth ? mediaSize : undefined }}>
          <RouteComponent
            as={getNFTSlug(nft)}
            href={`${getNFTSlug(nft)}?initialScrollIndex=${index}&type=feed`}
          >
            <Text tw="text-15 font-bold text-gray-900 dark:text-white">
              {nft?.token_name}
            </Text>

            <View tw="h-3" />
            <ClampText
              tw="text-sm text-gray-600 dark:text-gray-400"
              maxLines={4}
              text={description}
            />
          </RouteComponent>
          <View tw="mt-3 min-h-[20px]">
            <ClaimedBy
              claimersList={detailData?.data.item?.multiple_owners_list}
              avatarSize={18}
              nft={nft}
            />
          </View>
          <View tw="mt-3 flex-row items-center">
            <RouteComponent
              as={getNFTSlug(nft)}
              href={`${getNFTSlug(nft)}?initialScrollIndex=${index}&type=feed`}
            >
              <View
                tw="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900"
                style={{
                  width: mediaSize - 1,
                  height: mediaSize - 1,
                }}
              >
                <ListMedia
                  item={nft}
                  optimizedWidth={1000}
                  loading={index > 0 ? "lazy" : "eager"}
                />
                <View tw="absolute right-1.5 top-1.5">
                  <ContentType edition={edition} theme="light" />
                </View>
                <NSFWGate
                  show={nft.nsfw}
                  nftId={nft.nft_id}
                  variant="thumbnail"
                />
              </View>
            </RouteComponent>
            <FeedEngagementIcons nft={nft} edition={edition} />
          </View>
        </View>
      </View>
    </NativeRouteComponent>
  );
});
export const HomeItemSketelon = ({ mediaSize = 500 }) => {
  return (
    <View tw="mb-8">
      <View tw="mb-3 flex-row items-center">
        <Skeleton width={40} height={40} radius={999} show />
        <View tw="ml-2 justify-center">
          <Skeleton width={110} height={14} radius={4} show />
          <View tw="h-2" />
          <Skeleton width={60} height={12} radius={4} show />
        </View>
        <View tw="ml-auto flex-row items-center justify-center">
          <Skeleton width={80} height={22} radius={999} show />
          <View tw="w-2" />
          <Skeleton width={22} height={22} radius={999} show />
        </View>
      </View>
      <Skeleton width={200} height={20} radius={4} show />
      <View tw="h-3" />
      <Skeleton width={mediaSize} height={16} radius={4} show />
      <View tw="h-3" />
      <Skeleton width={300} height={16} radius={4} show />
      <View tw="h-3" />
      <Skeleton width={160} height={20} radius={4} show />
      <View tw="h-3" />

      <View tw="flex-row items-center">
        <Skeleton width={mediaSize} height={mediaSize} radius={16} show />
        <View tw="ml-4">
          <View tw="mb-4">
            <Skeleton height={56} width={56} radius={999} show />
            <View tw="mt-2 items-center">
              <Skeleton height={16} width={32} radius={6} show />
            </View>
          </View>
          <View tw="mb-4">
            <Skeleton height={56} width={56} radius={999} show />
            <View tw="mt-2 items-center">
              <Skeleton height={16} width={32} radius={6} show />
            </View>
          </View>
          <View>
            <Skeleton height={56} width={56} radius={999} show />
            <View tw="mt-2 items-center">
              <Skeleton height={16} width={32} radius={6} show />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
