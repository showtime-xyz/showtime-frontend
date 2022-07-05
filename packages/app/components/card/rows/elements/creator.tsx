import { formatDistanceToNowStrict } from "date-fns";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { Link } from "app/navigation/link";
import type { NFT } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

type Props = {
  nft?: NFT;
  shouldShowCreatorIndicator?: boolean;
  shouldShowDateCreated?: boolean;
  label?: string;
};

export function Creator({
  nft,
  shouldShowCreatorIndicator = true,
  shouldShowDateCreated = true,
  label = "Creator",
}: Props) {
  if (!nft) return null;

  return (
    <Link
      href={`/@${nft.creator_username ?? nft.creator_address}`}
      tw="flex flex-row py-4"
    >
      <Avatar url={nft.creator_img_url} />
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
            <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
              {getCreatorUsernameFromNFT(nft)}
            </Text>
            {nft.creator_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
          {Boolean(shouldShowDateCreated && nft.token_created) && (
            <>
              <View tw="h-2" />
              <Text tw="text-xs font-semibold text-gray-900 dark:text-white">
                {formatDistanceToNowStrict(new Date(`${nft.token_created}`), {
                  addSuffix: true,
                })}
              </Text>
            </>
          )}
        </View>
      </View>
    </Link>
  );
}
