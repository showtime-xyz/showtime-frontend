// import { Link } from "app/navigation/link";
import type { NFT } from "app/types";

import { Image } from "design-system/image";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
};

function Collection({ nft }: Props) {
  if (!nft) return null;

  return (
    // <Link href={`/c/${nft.collection_slug}`}>
    <View tw="h-9 flex-row items-center justify-between bg-white px-4 py-2 dark:bg-black">
      <View tw="flex-row items-center">
        {nft.collection_img_url && (
          <Image
            source={{ uri: nft.collection_img_url }}
            tw="h-5 w-5 rounded-full"
          />
        )}
        <Text
          tw={[
            nft.collection_img_url ? "ml-2" : "",
            "text-xs font-bold text-gray-600 dark:text-gray-400",
            // w-[65vw]
          ]}
          numberOfLines={1}
        >
          {nft.collection_name}
        </Text>
      </View>
      <Text tw="text-xs font-bold text-gray-600 dark:text-gray-400">
        {!nft.token_count || nft.token_count === 1
          ? "1 Edition"
          : `${nft.token_count} Editions`}
      </Text>
    </View>
    // </Link>
  );
}

export { Collection };
