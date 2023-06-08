import { useMemo } from "react";
import { Platform } from "react-native";

import { GiftSolid, Gift, Showtime } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { SocialButton } from "app/components/social-button";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";
import { formatClaimNumber } from "app/utilities";

import { FeedSocialButton } from "../feed-social-button";

export function ShowtimeClaimButton({
  nft,
  ...rest
}: {
  nft: NFT;
  tw?: string;
}) {
  const router = useRouter();
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  if (!edition) {
    return null;
  }

  return (
    <FeedSocialButton
      onPress={() => {
        const as = `/collectors/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
        router.push(
          Platform.select({
            native: as,
            web: {
              pathname: router.pathname,
              query: {
                ...router.query,
                contractAddress: nft?.contract_address,
                tokenId: nft?.token_id,
                chainName: nft?.chain_name,
                collectorsModal: true,
              },
            } as any,
          }),
          Platform.select({
            native: as,
            web: router.asPath,
          }),
          { shallow: true }
        );
      }}
      text={
        <>
          <Text
            tw={[
              "text-center text-xs font-semibold",
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count <=
                10 &&
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count >
                0
                ? "text-orange-500"
                : "text-gray-900 dark:text-white",
            ]}
          >
            {formatClaimNumber(edition.total_claimed_count)}
            {edition.creator_airdrop_edition.edition_size > 0
              ? `/${edition.creator_airdrop_edition.edition_size}`
              : ""}
          </Text>
        </>
      }
      {...rest}
    >
      <View tw="-z-1 absolute h-full w-full overflow-hidden rounded-full">
        <Image
          source={require("./showtime-abstract.png")}
          tw="absolute z-0 h-full w-full"
        />
      </View>
      <Showtime height={25} width={25} color={"#000"} />
    </FeedSocialButton>
  );
}
