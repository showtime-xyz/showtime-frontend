import { View } from "design-system/view";
import { Text } from "design-system/text";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";

import type { NFT } from "app/types";

type Props = {
  nft?: NFT;
  options?: boolean;
};

export function Creator({ nft }: Props) {
  if (!nft) return null;

  return (
    <View tw="flex flex-row">
      <Image
        tw="w-[32px] h-[32px] rounded-full"
        width={32}
        height={32}
        source={{ uri: nft.creator_img_url }}
      />
      <View tw="ml-1 justify-center">
        <Text
          sx={{ fontSize: 12, lineHeight: 12 }}
          tw="mb-0 text-gray-600 dark:text-gray-400 font-semibold"
        >
          {nft.creator_name}
        </Text>
        <View tw="h-[12px] flex flex-row items-center">
          <Text
            sx={{ fontSize: 13, lineHeight: 13 }}
            tw="text-gray-900 dark:text-white font-semibold"
          >
            @{nft.creator_username}
          </Text>
          {nft.creator_verified ? (
            <VerificationBadge style={{ marginLeft: 4 }} size={12} />
          ) : null}
        </View>
      </View>
    </View>
  );
}
