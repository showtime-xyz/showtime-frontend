import { useMemo, useCallback, memo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorOnFeed } from "app/components/creator-on-feed";
import { RouteComponent } from "app/components/route-component";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { linkifyDescription } from "app/lib/linkify";
import { NFT } from "app/types";
import { removeTags } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { LeanText, LeanView } from "../creator-channels/components/lean-text";
import { ClaimedBy } from "../feed-item/claimed-by";
import { NSFWGate } from "../feed-item/nsfw-gate";
import { FollowButtonSmall } from "../follow-button-small";
import { ListMedia } from "../media";
import { MuteButton } from "../mute-button";
import { NFTDropdown } from "../nft-dropdown";
import { ItemKeyContext } from "../viewability-tracker-flatlist";
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

export const HomeItem = memo<{ nft: NFT; index: number; mediaSize: number }>(
  function HomeItem({ nft, mediaSize, index }) {
    const { width } = useWindowDimensions();
    const isMdWidth = useMemo(() => width >= breakpoints["md"], [width]);
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

    const mediaViewStyle = useMemo(
      () => ({
        width: mediaSize - 1,
        height: mediaSize - 1,
      }),
      [mediaSize]
    );

    return (
      <ItemKeyContext.Provider value={index}>
        <NativeRouteComponent
          href={`${getNFTSlug(nft)}?initialScrollItemId=${
            nft.nft_id
          }&type=feed`}
        >
          <LeanView tw="mb-2 mt-6 px-4 md:px-0">
            <CreatorOnFeed
              nft={nft}
              rightElement={
                <>
                  <FollowButtonSmall
                    profileId={nft.creator_id}
                    name={nft.creator_username}
                    channelId={detailData?.data.item?.creator_channel_id}
                    tw="mr-4"
                  />
                  <NFTDropdown
                    nft={nft}
                    edition={edition}
                    iconSize={20}
                    iconColor={isDark ? colors.gray[100] : colors.gray[900]}
                    shouldEnableSharing={false}
                  />
                </>
              }
            />
            <LeanView
              tw="mt-3"
              style={{ maxWidth: isMdWidth ? mediaSize : undefined }}
            >
              <RouteComponent
                as={getNFTSlug(nft)}
                href={`${getNFTSlug(nft)}?initialScrollItemId=${
                  nft.nft_id
                }&type=feed`}
              >
                <LeanText tw="text-15 font-bold text-gray-900 dark:text-white">
                  {nft?.token_name}
                </LeanText>

                <LeanView tw="h-3" />
                <LeanText
                  tw="text-sm text-gray-600 dark:text-gray-400"
                  numberOfLines={5}
                >
                  {description}
                </LeanText>
              </RouteComponent>
              <LeanView tw="mt-3 min-h-[20px]">
                <ClaimedBy
                  claimersList={detailData?.data.item?.multiple_owners_list}
                  avatarSize={18}
                  nft={nft}
                />
              </LeanView>
              <LeanView tw="mt-3 flex-row items-center">
                <RouteComponent
                  as={getNFTSlug(nft)}
                  href={`${getNFTSlug(nft)}?initialScrollItemId=${
                    nft.nft_id
                  }&type=feed`}
                >
                  <LeanView
                    tw="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900"
                    style={mediaViewStyle}
                  >
                    <LeanView
                      style={{
                        width: mediaSize,
                        height: mediaSize,
                      }}
                    >
                      <ListMedia
                        item={nft}
                        optimizedWidth={1000}
                        loading={index > 0 ? "lazy" : "eager"}
                      />
                      <LeanView tw="absolute right-1.5 top-1.5">
                        <ContentType edition={edition} theme="light" />
                      </LeanView>
                      <NSFWGate
                        show={nft.nsfw}
                        nftId={nft.nft_id}
                        variant="thumbnail"
                      />
                      {nft?.mime_type?.includes("video") ? (
                        <LeanView tw="z-9 absolute bottom-2 right-2">
                          <MuteButton size={16} />
                        </LeanView>
                      ) : null}
                    </LeanView>
                  </LeanView>
                </RouteComponent>
                <FeedEngagementIcons nft={nft} edition={edition} />
              </LeanView>
            </LeanView>
          </LeanView>
        </NativeRouteComponent>
      </ItemKeyContext.Provider>
    );
  }
);

export const HomeItemSketelon = ({ mediaSize = 500 }) => {
  return (
    <LeanView tw="mb-8">
      <LeanView tw="mb-3 flex-row items-center">
        <Skeleton width={40} height={40} radius={999} show />
        <LeanView tw="ml-2 justify-center">
          <Skeleton width={110} height={14} radius={4} show />
          <LeanView tw="h-2" />
          <Skeleton width={60} height={12} radius={4} show />
        </LeanView>
        <LeanView tw="ml-auto flex-row items-center justify-center">
          <Skeleton width={80} height={22} radius={999} show />
          <LeanView tw="w-2" />
          <Skeleton width={22} height={22} radius={999} show />
        </LeanView>
      </LeanView>
      <Skeleton width={200} height={20} radius={4} show />
      <LeanView tw="h-3" />
      <Skeleton width={mediaSize} height={16} radius={4} show />
      <LeanView tw="h-3" />
      <Skeleton width={300} height={16} radius={4} show />
      <LeanView tw="h-3" />
      <Skeleton width={160} height={20} radius={4} show />
      <LeanView tw="h-3" />

      <LeanView tw="flex-row items-center">
        <Skeleton width={mediaSize} height={mediaSize} radius={16} show />
        <LeanView tw="ml-4">
          <LeanView tw="mb-4">
            <Skeleton height={56} width={56} radius={999} show />
            <LeanView tw="mt-2 items-center">
              <Skeleton height={8} width={24} radius={6} show />
            </LeanView>
          </LeanView>
          <LeanView tw="mb-4">
            <Skeleton height={56} width={56} radius={999} show />
            <LeanView tw="mt-2 items-center">
              <Skeleton height={8} width={24} radius={6} show />
            </LeanView>
          </LeanView>
          <LeanView>
            <Skeleton height={56} width={56} radius={999} show />
            <LeanView tw="mt-2 items-center">
              <Skeleton height={8} width={24} radius={6} show />
            </LeanView>
          </LeanView>
        </LeanView>
      </LeanView>
    </LeanView>
  );
};
