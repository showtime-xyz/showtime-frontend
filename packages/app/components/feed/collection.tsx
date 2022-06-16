import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import type { NFT } from "app/types";

type Props = {
  nft?: NFT;
};

function Collection({ nft }: Props) {
  if (!nft) return null;

  return (
    // <Link href={`/c/${nft.collection_slug}`}>
    <View tw="flex-row items-center justify-between">
      <View tw="flex-row items-center">
        {nft.collection_img_url && (
          <Image
            source={{ uri: nft.collection_img_url }}
            tw="h-5 w-5 rounded-full"
          />
        )}
        <Text
          tw={`${
            nft.collection_img_url ? "ml-2" : ""
          } text-xs font-bold dark:text-white`}
          numberOfLines={1}
        >
          {nft.collection_name}
        </Text>
      </View>
      <Text tw="text-xs text-gray-900 dark:text-white">
        {!nft.token_count || nft.token_count === 1
          ? "1 Edition"
          : `${nft.token_count} Editions`}
      </Text>
    </View>
    // </Link>
  );
}

export { Collection };
