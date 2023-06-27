import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { formatDistanceToNowStrict } from "date-fns";
import { ResizeMode } from "expo-av";

import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
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
import {
  convertUTCDateToLocalDate,
  getCreatorUsernameFromNFT,
  removeTags,
} from "app/utilities";

import { AvatarHoverCard } from "../card/avatar-hover-card";
import { ClaimedBy } from "../feed-item/claimed-by";
import { NSFWGate } from "../feed-item/nsfw-gate";
import { FollowButtonSmall } from "../follow-button-small";
import { ListMedia } from "../media";
import { ContentType } from "./content-type";
import { FeedEngagementIcons } from "./engagement-icons";

export const HomeItem = ({
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
          <Link
            href={`/@${nft.creator_username ?? nft.creator_address}`}
            tw="flex-row items-center justify-center"
          >
            <Text tw="text-sm font-medium text-gray-900 dark:text-white">
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

        <FollowButtonSmall
          profileId={nft.creator_id}
          name={nft.creator_username}
          tw="ml-auto"
        />
      </View>
      <View tw="mt-3">
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
              tw="overflow-hidden rounded-2xl"
              style={{
                width: mediaSize,
                height: mediaSize,
              }}
            >
              <ListMedia
                item={nft}
                resizeMode={ResizeMode.COVER}
                optimizedWidth={600}
                loading={index > 0 ? "lazy" : "eager"}
              />
              <View tw="absolute right-1.5 top-1.5">
                <ContentType edition={edition} />
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
  );
};
export const HomeItemSketelon = () => {
  const { width } = useWindowDimensions();

  return (
    <View tw="mb-8">
      <View tw="mb-3 flex-row items-center">
        <Skeleton width={40} height={40} radius={999} show />
        <View tw="ml-2 justify-center">
          <Skeleton width={110} height={14} radius={4} show />
          <View tw="h-2" />
          <Skeleton width={60} height={12} radius={4} show />
        </View>
        <Skeleton tw="ml-auto" width={74} height={22} radius={999} show />
      </View>
      <Skeleton width={200} height={20} radius={4} show />
      <Skeleton
        width={Math.min(width, 400)}
        height={16}
        radius={4}
        show
        tw="my-3"
      />
      <Skeleton width={300} height={16} radius={4} show />
      <Skeleton width={160} height={20} radius={4} show tw="my-3" />
      <View tw="flex-row items-center">
        <Skeleton width={300} height={300} radius={16} show />
        <View tw="ml-4">
          <View tw="mb-4">
            <Skeleton height={56} width={56} radius={999} show={true} />
            <View tw="mt-2 items-center">
              <Skeleton height={16} width={32} radius={6} show={true} />
            </View>
          </View>
          <View tw="mb-4">
            <Skeleton height={56} width={56} radius={999} show={true} />
            <View tw="mt-2 items-center">
              <Skeleton height={16} width={32} radius={6} show={true} />
            </View>
          </View>
          <View>
            <Skeleton height={56} width={56} radius={999} show={true} />
          </View>
        </View>
      </View>
    </View>
  );
};
