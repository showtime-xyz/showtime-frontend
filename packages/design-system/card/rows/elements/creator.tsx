import { Link } from "app/navigation/link";
import type { NFT } from "app/types";

import { Avatar } from "design-system/avatar";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
  options?: boolean;
};

export function Creator({ nft }: Props) {
  if (!nft) return null;

  return (
    <Link
      href={`/@${nft.creator_username ?? nft.creator_address}`}
      tw="flex flex-row"
    >
      <Avatar url={nft.creator_img_url} />
      <View tw="ml-2 justify-center">
        <Text
          sx={{ fontSize: 12, lineHeight: 12 }}
          tw={`${
            nft.creator_username ? "mb-1" : ""
          } text-gray-600 dark:text-gray-400 font-semibold`}
        >
          Creator
        </Text>
        {nft.creator_username && (
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
        )}
      </View>
    </Link>
  );
}
