import { formatDistanceToNowStrict } from "date-fns";

import { Link } from "app/navigation/link";
import type { NFT } from "app/types";
import { formatAddressShort } from "app/utilities";

import { Avatar } from "design-system/avatar";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
  shouldShowCreatorIndicator?: boolean;
  shouldShowDateCreated?: boolean;
};

export function Creator({
  nft,
  shouldShowCreatorIndicator = true,
  shouldShowDateCreated = true,
}: Props) {
  if (!nft) return null;

  return (
    <Link
      href={`/@${nft.creator_username ?? nft.creator_address}`}
      tw="flex flex-row py-2"
    >
      <Avatar url={nft.creator_img_url} />
      <View tw="ml-2 justify-center">
        {shouldShowCreatorIndicator && (
          <>
            <Text
              variant="text-xs"
              tw="font-semibold text-gray-600 dark:text-gray-400"
            >
              Creator
            </Text>
            <View tw="h-2" />
          </>
        )}
        <View>
          <View tw="flex flex-row items-center">
            <Text
              variant="text-13"
              tw="font-semibold text-gray-900 dark:text-white"
            >
              {nft.creator_username
                ? `@${nft.creator_username}`
                : nft.creator_name
                ? nft.creator_name
                : formatAddressShort(nft.creator_address)}
            </Text>
            {nft.creator_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
          {shouldShowDateCreated && nft.token_created ? (
            <Text
              variant="text-xs"
              tw="mt-1 font-semibold text-gray-900 dark:text-white"
            >
              {formatDistanceToNowStrict(new Date(`${nft.token_created}`), {
                addSuffix: true,
              })}
            </Text>
          ) : null}
        </View>
      </View>
    </Link>
  );
}
