import { formatDistanceToNowStrict } from "date-fns";

import { Link } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";
import { formatAddressShort } from "app/utilities";

import { Avatar } from "design-system/avatar";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
  options?: boolean;
};

export function Creator({ nft }: Props) {
  const router = useRouter();

  if (!nft) return null;

  return (
    <Link
      href={`/@${nft.creator_username ?? nft.creator_address}`}
      tw="flex flex-row"
    >
      <Avatar url={nft.creator_img_url} />
      <View tw="ml-2 justify-center">
        {nft.creator_username ? (
          <View tw="h-[12px] flex flex-row items-center">
            <Text
              sx={{ fontSize: 13, lineHeight: 15 }}
              tw="text-gray-900 dark:text-white font-semibold"
            >
              @{nft.creator_username}
            </Text>
            {nft.creator_verified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
        ) : (
          <View>
            <Text
              sx={{ fontSize: 13 }}
              tw="text-gray-900 dark:text-white font-bold"
            >
              {formatAddressShort(nft.creator_address)}
            </Text>
            {nft.token_created ? (
              <Text tw="text-xs text-gray-900 dark:text-white mt-1 font-semibold">
                {formatDistanceToNowStrict(new Date(`${nft.token_created}`), {
                  addSuffix: true,
                })}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    </Link>
  );
}
