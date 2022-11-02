import { Platform } from "react-native";

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
    <View tw="h-9 flex-row items-center justify-between bg-white px-4 py-2 dark:bg-black">
      <View tw="flex-1 flex-row items-center">
        {nft.collection_img_url && (
          <View
            // @ts-ignore
            style={Platform.select({
              default: {},
              web: {
                filter:
                  "drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.5)) drop-shadow(0px 8px 16px rgba(255, 255, 255, 0.1))",
              },
            })}
          >
            <Image
              source={{ uri: nft.collection_img_url }}
              tw="rounded-full"
              width={20}
              height={20}
              alt={nft.collection_name}
            />
          </View>
        )}
        <Text
          tw={[
            nft.collection_img_url ? "ml-2" : "",
            "text-xs font-bold text-gray-600 dark:text-gray-400",
          ]}
          numberOfLines={1}
        >
          {nft.collection_name}
        </Text>
      </View>
      <Text tw="ml-1 flex-nowrap text-xs font-bold text-gray-600 dark:text-gray-400">
        {!nft.token_count || nft.token_count === 1
          ? "1 Edition"
          : `${nft.token_count} Editions`}
      </Text>
    </View>
  );
}

export { Collection };
