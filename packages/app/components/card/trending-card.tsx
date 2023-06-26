import { Platform } from "react-native";

import { ResizeMode } from "expo-av";

import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ListMedia } from "app/components/media";
import { RouteComponent } from "app/components/route-component";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { TextLink } from "app/navigation/link";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { ClaimButtonSimplified } from "../claim/claim-button-simplified";
import { NSFWGate } from "../feed-item/nsfw-gate";
import { AvatarHoverCard } from "./avatar-hover-card";

export const TrendingCard = ({ index, nft, width }: any) => {
  const { data: edition, loading } = useCreatorCollectionDetail(
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
      <RouteComponent
        as={getNFTSlug(nft)}
        href={`${getNFTSlug(
          nft
        )}?initialScrollIndex=${index}&filter=all&type=trendingNFTs`}
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
          tw="inline-block max-w-[100px] flex-nowrap overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
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
        tw="mt-2"
      >
        <Text tw="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
          {nft?.token_name}
        </Text>
      </RouteComponent>
      {edition && (
        <View tw="mt-2.5 flex-row items-center">
          <ClaimButtonSimplified edition={edition} loading={loading} />
          <Text tw="ml-3 text-xs font-bold text-gray-900 dark:text-white">
            {edition?.total_claimed_count.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};
