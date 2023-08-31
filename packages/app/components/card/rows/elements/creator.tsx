import { formatDistanceToNowStrict } from "date-fns";

import { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { TextLink } from "app/navigation/link";
import type { NFT } from "app/types";
import {
  convertUTCDateToLocalDate,
  getClaimLimitLeftDuration,
  getCreatorUsernameFromNFT,
} from "app/utilities";

type Props = {
  nft?: Pick<
    NFT,
    | "creator_username"
    | "creator_img_url"
    | "creator_address"
    | "creator_name"
    | "token_created"
  > & {
    creator_verified: boolean | number | undefined;
    creator_address_nonens?: string;
  };
  shouldShowCreatorIndicator?: boolean;
  shouldShowDateCreated?: boolean;
  label?: string;
  size?: number;
  tw?: TW;
  timeLimit: string | null | undefined;
};

export function Creator({
  nft,
  shouldShowCreatorIndicator = false,
  shouldShowDateCreated = true,
  label = "Creator",
  size = 32,
  tw = "",
  timeLimit,
}: Props) {
  if (!nft) return null;

  return (
    <View tw={["flex flex-row py-4", tw]}>
      <AvatarHoverCard
        username={nft?.creator_username || nft?.creator_address_nonens}
        url={nft.creator_img_url}
        size={size}
      />
      <View tw="ml-2 justify-center">
        {shouldShowCreatorIndicator && (
          <>
            <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {label}
            </Text>
            <View tw="h-2" />
          </>
        )}
        <View>
          <View tw="flex flex-row items-center">
            <TextLink
              href={`/@${nft.creator_username ?? nft.creator_address}`}
              tw="text-13 flex font-semibold text-gray-900 dark:text-white"
            >
              {getCreatorUsernameFromNFT(nft)}
            </TextLink>

            {nft.creator_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>

          {Boolean(
            shouldShowDateCreated && (nft.token_created || timeLimit)
          ) && (
            <>
              <View tw="h-2" />
              <Text tw="text-xs font-semibold text-gray-900 dark:text-white">
                {timeLimit
                  ? getClaimLimitLeftDuration(timeLimit)
                  : formatDistanceToNowStrict(
                      convertUTCDateToLocalDate(nft.token_created),
                      {
                        addSuffix: true,
                      }
                    )}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
