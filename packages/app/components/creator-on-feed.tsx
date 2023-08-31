import { memo, isValidElement } from "react";
import { Platform } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { Link } from "app/navigation/link";
import { NFT } from "app/types";
import {
  getClaimLimitLeftDuration,
  getCreatorUsernameFromNFT,
} from "app/utilities";

export const CreatorOnFeed = memo<{
  nft: NFT;
  rightElement?: JSX.Element;
  dark?: boolean;
  timeLimit?: string;
}>(function HomeItem({ nft, rightElement, dark = false, timeLimit }) {
  return (
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
            tw={[
              "max-w-[150px] text-sm font-medium md:max-w-none",
              dark ? "text-white" : "text-gray-900 dark:text-white",
            ]}
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
              {...(dark ? { fillColor: "#18181B", bgColor: "#fff" } : {})}
            />
          ) : null}
        </Link>
        <View tw="h-2" />
        <Text
          tw={[
            "text-xs",
            dark ? "text-gray-200" : "text-gray-600 dark:text-gray-400",
          ]}
        >
          {timeLimit
            ? getClaimLimitLeftDuration(timeLimit)
            : `${nft?.creator_followers_count?.toLocaleString()} Followers`}
        </Text>
      </View>
      {isValidElement(rightElement) ? (
        <View tw="ml-auto flex-row items-center">{rightElement}</View>
      ) : null}
    </View>
  );
});
